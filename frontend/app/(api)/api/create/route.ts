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
        const response_json = await response.json()

        if (response_json.status == "ok") {
            return NextResponse.json({
                status: "success",
            })
        } else {
            return NextResponse.json({
                status: "error",
            })
        }

    } catch (err) {
        return NextResponse.json({
            status: "error",
        })
    }
}
