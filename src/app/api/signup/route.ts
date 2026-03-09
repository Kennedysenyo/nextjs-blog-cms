import { auth } from "@/lib/better-auth/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    console.log("Stating signup ...");
    const data = await auth.api.signUpEmail({
      body: {
        name: "Kennedy Senyo",
        email: "kensenyocoding@gmail.com",
        password: "pass1234#",
      },
    });

    // console.log(data);

    console.log("Function call returned ...");

    return NextResponse.json("User created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(error.message, { status: 500 });
    }
    return NextResponse.json(error as string, { status: 500 });
  }
};
