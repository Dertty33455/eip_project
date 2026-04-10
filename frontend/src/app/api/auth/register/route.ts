import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      const text = await response.text()
      try {
        const errorData = JSON.parse(text)
        return NextResponse.json(errorData, { status: response.status })
      } catch (e) {
        console.error('Non-JSON response from backend:', text.substring(0, 100))
        return NextResponse.json({ error: 'Backend error' }, { status: response.status })
      }
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Register API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
