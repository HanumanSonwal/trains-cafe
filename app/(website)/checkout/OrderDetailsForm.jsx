import { Input, Form, Row, Col, Divider } from "antd";
import { useEffect, useRef, useState } from "react";
import { loadContact, loadJourney, saveJourney } from "@/app/lib/journeyStore";

const OrderDetailsForm = ({ createLead, updateLead, form, trainNumber }) => {
  const pnr = Form.useWatch("pnr", form);
  const [pnrLookup, setPnrLookup] = useState({ loading: false, message: "" });
  const latestPnr = useRef("");
  const updateLeadRef = useRef(updateLead);
  updateLeadRef.current = updateLead;
  const createLeadRef = useRef(createLead);
  createLeadRef.current = createLead;

  useEffect(() => {
    const value = String(pnr || "").trim();
    if (!/^\d{10}$/.test(value)) {
      latestPnr.current = "";
      setPnrLookup((current) =>
        current.loading || current.message ? { loading: false, message: "" } : current
      );
      return;
    }
    if (latestPnr.current === value) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      latestPnr.current = value;
      setPnrLookup({ loading: true, message: "Fetching train and seat details…" });
      try {
        const response = await fetch("/api/railradar/pnr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pnr: value }),
          signal: controller.signal,
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not fetch PNR details");
        }

        const details = result.data || {};
        const fields = {
          trainNo: details.trainNo || "",
          coach: details.coach || "",
          seatNo: details.seatNo || "",
        };
        form.setFieldsValue(fields);
        saveJourney(value, details); // next order on this device starts filled in
        await updateLeadRef.current({ ...form.getFieldsValue(), ...fields });

        const hasSeat = fields.coach || fields.seatNo;
        const extraPassengers = Math.max(0, Number(details.passengerCount || 0) - 1);
        setPnrLookup({
          loading: false,
          message: `Train details filled${hasSeat ? " with passenger 1's coach and seat" : ""}${extraPassengers ? `; ${extraPassengers} more passenger${extraPassengers === 1 ? "" : "s"} on this PNR` : ""}.`,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setPnrLookup({ loading: false, message: error.message || "Could not fetch PNR details" });
          latestPnr.current = "";
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [pnr, form]);

  // Prefill once: name + mobile from the last order, and the PNR searched on the home
  // page (train, coach, seat) unless the cart is for a different train.
  // Declared after the PNR effect so that effect sees the PNR as already looked up.
  useEffect(() => {
    const fill = {};
    const contact = loadContact();
    if (contact?.mobile && !form.getFieldValue("mobile")) fill.mobile = contact.mobile;
    if (contact?.name && !form.getFieldValue("name")) fill.name = contact.name;

    const journey = loadJourney();
    const cartTrain = String(trainNumber || "");
    const typedPnr = form.getFieldValue("pnr");
    if (journey && (!typedPnr || typedPnr === journey.pnr) && (!cartTrain || cartTrain === journey.trainNo)) {
      latestPnr.current = journey.pnr;
      Object.assign(fill, {
        pnr: journey.pnr,
        trainNo: journey.trainNo,
        coach: journey.coach,
        seatNo: journey.seatNo,
      });
      setPnrLookup({ loading: false, message: "Train details filled from your PNR." });
    } else if (cartTrain && !form.getFieldValue("trainNo")) {
      fill.trainNo = cartTrain;
    }

    if (Object.keys(fill).length) form.setFieldsValue(fill);
    if (fill.mobile) createLeadRef.current(fill.mobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-2 sm:p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Customer Order Details
      </h2>

      <Divider orientation="left">User Details</Divider>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="mobile"
            label="Mobile Number"
            style={{ marginBottom: 12 }}
            rules={[
              { required: true, message: "Mobile number is required" },
              { pattern: /^\d{10}$/, message: "Enter 10 digit mobile number" },
            ]}
          >
            <Input
              placeholder="Mobile Number"
              inputMode="tel"
              autoComplete="tel-national"
              maxLength={10}
              onBlur={() => {
                const mobile = form.getFieldValue("mobile");
                if (mobile?.length === 10) createLead(mobile);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item name="name" label="Name" style={{ marginBottom: 12 }}>
            <Input
              placeholder="Name"
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="alternateMobile"
            label="Alternate Mobile (Optional)"
            style={{ marginBottom: 12 }}
          >
            <Input
              placeholder="Alternate Mobile"
              maxLength={10}
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Train Details</Divider>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="pnr"
            label="PNR (Optional)"
            style={{ marginBottom: 12 }}
            rules={[{ pattern: /^\d{10}$/, message: "PNR has 10 digits (or leave it empty)" }]}
          >
            <Input
              placeholder="10 digit PNR (fills train & seat)"
              inputMode="numeric"
              maxLength={10}
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>

        {pnrLookup.message && (
          <Col span={24}>
            <p
              role="status"
              aria-live="polite"
              className={`-mt-2 text-xs ${pnrLookup.loading ? "text-gray-500" : pnrLookup.message.startsWith("Train details filled") ? "text-green-700" : "text-red-600"}`}
            >
              {pnrLookup.message}
            </p>
          </Col>
        )}

        <Col xs={24} sm={12}>
          <Form.Item
            name="trainNo"
            label="Train Number"
            style={{ marginBottom: 12 }}
          >
            <Input
              placeholder="Train Number"
              maxLength={5}
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item name="coach" label="Coach" style={{ marginBottom: 12 }}>
            <Input
              placeholder="Coach"
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="seatNo"
            label="Seat No."
            style={{ marginBottom: 12 }}
          >
            <Input
              placeholder="Seat No."
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="instructions"
            label="Optional Instructions"
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea
              rows={3}
              placeholder="Optional Instructions"
              onBlur={() => updateLead(form.getFieldsValue())}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailsForm;
