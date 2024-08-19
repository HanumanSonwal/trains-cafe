"use client";
import { useState } from "react";
import {
  Table,
  Button,
  Input as AntdInput,
  message,
  Switch,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteFilled,
  EditFilled,
} from "@ant-design/icons";
import StationsForm from "./StationsForm";

const initialStations = [
  {
    key: "1",
    name: "Aligarh Junction",
    code: "ALJN",
    location: "Aligarh",
    address: "Aligarh Junction, Aligarh, Uttar Pradesh, India",
    status: "1",
  },
  {
    key: "2",
    name: "Prayagraj Chheoki",
    code: "PCOI",
    location: "Prayagraj",
    address: "Naini Gaon, Naini, Chak Imam Ali, Uttar Pradesh 211008",
    status: "0",
  },
  {
    key: "3",
    name: "Zawar",
    code: "ZW",
    location: "Zawar",
    address: "Naini Gaon, Naini, Chak Imam Ali, Uttar Pradesh 211008",
    status: "1",
  },
  {
    key: "4",
    name: "Zarap",
    code: "ZARP",
    location: "Zarap",
    address: "",
    status: "0",
  },
  {
    key: "5",
    name: "Zangalapalle",
    code: "ZPL",
    location: "Zangalapalle",
    address: "",
    status: "1",
  },
  {
    key: "6",
    name: "Zampini",
    code: "ZPI",
    location: "Zampini",
    address: "",
    status: "1",
  },
  {
    key: "7",
    name: "Zamania",
    code: "ZNA",
    location: "Zamania",
    address: "Naini Gaon, Naini, Chak Imam Ali, Uttar Pradesh 211008",
    status: "0",
  },
  {
    key: "8",
    name: "Zahirabad",
    code: "ZB",
    location: "Zahirabad",
    address: "",
    status: "1",
  },
  {
    key: "9",
    name: "Zafarabad Junction",
    code: "ZBD",
    location: "Zafarabad Junction",
    address: "",
    status: "1",
  },
  {
    key: "10",
    name: "Yusufpur",
    code: "YFP",
    location: "Yusufpur",
    address: "Naini Gaon, Naini, Chak Imam Ali, Uttar Pradesh 211008",
    status: "0",
  },
  {
    key: "11",
    name: "Yevat",
    code: "YT",
    location: "Yevat",
    address: "",
    status: "1",
  },
];

const StationManagement = () => {
  const [stations, setStations] = useState(initialStations);
  const [filteredStations, setFilteredStations] = useState(initialStations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [searchText, setSearchText] = useState("");

  const handleAdd = () => {
    setEditingStation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingStation(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setStations(stations.filter((station) => station.key !== key));
    setFilteredStations(
      filteredStations.filter((station) => station.key !== key)
    );
    message.success("Station deleted successfully");
  };

  const handleFormSubmit = (values) => {
    if (editingStation) {
      setStations(
        stations.map((station) =>
          station.key === editingStation.key
            ? { ...values, key: editingStation.key }
            : station
        )
      );
      setFilteredStations(
        filteredStations.map((station) =>
          station.key === editingStation.key
            ? { ...values, key: editingStation.key }
            : station
        )
      );
      message.success("Station updated successfully");
    } else {
      const newStation = { ...values, key: `${stations.length + 1}` };
      setStations([...stations, newStation]);
      setFilteredStations([...filteredStations, newStation]);
      message.success("Station added successfully");
    }
    setIsModalOpen(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filtered = stations.filter((station) =>
      Object.values(station).some((val) =>
        val.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredStations(filtered);
  };

  const handleStatusChange = (checked, key) => {
    setStations(
      stations.map((station) =>
        station.key === key
          ? { ...station, status: checked ? "1" : "0" }
          : station
      )
    );
    setFilteredStations(
      filteredStations.map((station) =>
        station.key === key
          ? { ...station, status: checked ? "1" : "0" }
          : station
      )
    );
    message.success("Station status updated successfully");
  };

  const columns = [
    {
      title: "Station Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Station Code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status === "1"}
          onChange={(checked) => handleStatusChange(checked, record.key)}
          className={status === "1" ? "ant-switch-checked" : "ant-switch"}
        />
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="space-x-2">
          <Button
            icon={<EditFilled />}
            onClick={() => handleEdit(record)}
            style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button icon={<DeleteFilled />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "#FAF3CC",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: "#6F4D27" }}>
        Station Management
      </h2>
      <div className="flex items-center mb-4 justify-between">
        <AntdInput
          placeholder="Search"
          style={{ width: 200, borderColor: "#D6872A" }}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
        <Button
          type="primary"
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Station
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredStations}
        pagination={{ pageSize: 10 }}
      />

      <StationsForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={editingStation}
      />
    </div>
  );
};

export default StationManagement;
