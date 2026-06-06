import fs from "fs";
import path from "path";

const uploadCandidates = [
  path.join(process.cwd(), "middleware", "uploads"),
  path.join(process.cwd(), "serverFolder", "middleware", "uploads"),
];

export const uploadDir =
  uploadCandidates.find((dir) => fs.existsSync(dir)) ||
  uploadCandidates[0];

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
