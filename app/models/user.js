
import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // module key, see app/lib/rbac.js
    level: { type: String, enum: ['view', 'full'], default: 'view' },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'sub-admin', 'staff'], default: 'user' },
    // staff only: which modules they can open and how far
    permissions: { type: [PermissionSchema], default: [] },
    // a switched-off account cannot sign in
    active: { type: Boolean, default: true },
    createdBy: { type: String, default: '' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
