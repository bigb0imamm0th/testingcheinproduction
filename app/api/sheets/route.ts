import { NextRequest, NextResponse } from 'next/server';
import { appendToGoogleSheet, testGoogleSheetsConnection } from '@/lib/google-sheets';
import type { TransportationCostData } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, action } = body;

    // Test connection
    if (action === 'test') {
      const result = await testGoogleSheetsConnection();
      return NextResponse.json({ success: true, ...result });
    }

    // Append data to sheet
    if (action === 'append' && data) {
      const { userId, userName } = body;
      
      if (!userId || !userName) {
        return NextResponse.json(
          { success: false, error: 'UserId and userName are required' },
          { status: 400 }
        );
      }

      const result = await appendToGoogleSheet(
        data as TransportationCostData,
        userId,
        userName
      );
      return NextResponse.json({ 
        success: true, 
        message: `Data added to ${result.sheetName} at row ${result.row}`,
        row: result.row,
        sheetName: result.sheetName
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action or missing data' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to update Google Sheet',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

