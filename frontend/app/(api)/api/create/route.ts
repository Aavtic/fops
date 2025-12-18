import { NextResponse } from "next/server"

import { AllProblemEndpoint } from '@/lib/http/endpoints'

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const response = await fetch(
            AllProblemEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            }
        );
        const response_json = await response.json()

        if (response_json.status == "success") {
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
