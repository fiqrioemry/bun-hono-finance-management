import * as bcrypt from "bcryptjs";

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function generateOTP(): Promise<string> {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % 1_000_000).toString().padStart(6, "0");
}

export async function generateToken(length: number = 32): Promise<string> {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

export async function generateAvatar(name: string): Promise<string> {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=random&size=128&bold=true`;
}
