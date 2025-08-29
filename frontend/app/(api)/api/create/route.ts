import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const response = await fetch(
            "http://localhost:8080/api/db/add_question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            }
        );
        console.log(await response.text())

        return NextResponse.json({
            status: "success",
        })

    } catch (err) {
        return NextResponse.json({
            status: "error",
        })
    }
}
