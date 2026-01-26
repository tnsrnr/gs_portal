import { NextRequest, NextResponse } from 'next/server';
import pool from '@/global/lib/db';

/**
 * POST: 학습 세션 저장
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_name, category_l1, study_duration, study_date } = body;

    // 필수 필드 검증
    if (!student_name || !category_l1 || study_duration === undefined || !study_date) {
      return NextResponse.json(
        {
          success: false,
          error: '필수 필드가 누락되었습니다. (student_name, category_l1, study_duration, study_date)',
        },
        { status: 400 }
      );
    }

    // 데이터베이스에 저장
    const query = `
      INSERT INTO study_sessions (student_name, category_l1, study_duration, study_date)
      VALUES ($1, $2, $3, $4)
      RETURNING id, student_name, category_l1, study_duration, study_date, created_at
    `;

    const values = [
      student_name,
      category_l1,
      study_duration,
      new Date(study_date),
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error saving study session:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET: 학습 세션 조회
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const student_name = searchParams.get('student_name');
    const category_l1 = searchParams.get('category_l1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = 'SELECT * FROM study_sessions WHERE 1=1';
    const values: any[] = [];
    let paramIndex = 1;

    if (student_name) {
      query += ` AND student_name = $${paramIndex}`;
      values.push(student_name);
      paramIndex++;
    }

    if (category_l1) {
      query += ` AND category_l1 = $${paramIndex}`;
      values.push(category_l1);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching study sessions:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
