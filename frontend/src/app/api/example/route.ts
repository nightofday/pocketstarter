import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/server'

// Example protected route - replace with your actual protected endpoint
export async function GET() {
  try {
    const user = await requireAuth()
    
    // This is where you would add your protected route logic
    return NextResponse.json({ 
      message: 'Protected route accessed successfully',
      user: {
        id: user.id,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Protected route error:', error)
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Example POST endpoint for protected routes
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    
    // This is where you would add your protected POST logic
    return NextResponse.json({ 
      message: 'Protected POST route accessed successfully',
      user: {
        id: user.id,
        email: user.email
      },
      data: body
    })
  } catch (error) {
    console.error('Protected route error:', error)
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 