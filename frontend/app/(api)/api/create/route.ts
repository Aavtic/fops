import connectionToDB from "@/lib/mongoose";
import Problem from "@/models/Problem"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const {title, description} = await request.json()
        await connectionToDB()
        const newProblem = new Problem({title, description})
        await newProblem.save()

        return NextResponse.json(newProblem, {
            status: 200,
        })

    } catch (err) {
        console.log(err)
    }
}
