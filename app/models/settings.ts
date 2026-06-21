import { Schema, model, models, Document } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  footerText: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  postSettings: {
    postsPerPage: number;
    autoApproveComments: boolean;
  };
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: "Heritage Blog" },
    siteDescription: { type: String, default: "Chronicles of the Ethereal" },
    contactEmail: { type: String, default: "" },
    footerText: { type: String, default: "© 2026 Heritage. All rights reserved." },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    postSettings: {
      postsPerPage: { type: Number, default: 10 },
      autoApproveComments: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Settings = models.Settings || model<ISettings>("Settings", SettingsSchema);
export default Settings;
