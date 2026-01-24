import { NextRequest, NextResponse } from 'next/server';
import pool from '@/global/lib/db';

/**
 * GET: 토픽 목록 조회
 * 
 * Query Parameters:
 * - id: ID 필터 (선택)
 * - importance: 중요도 필터 (선택)
 * - category_l1: 대분류 필터 (선택)
 * - category_l2: 중분류 필터 (선택)
 * - category_l3: 소분류 필터 (선택)
 * - topic: 토픽 이름 필터 (선택)
 * - topics_eng: 영문명 필터 (선택)
 * - topics_loc: 한글명 필터 (선택)
 * - parent_topic: 상위 토픽 필터 (선택)
 * - child_topic: 하위 토픽 필터 (선택)
 * - definition: 정의 필터 (선택, 부분 일치)
 * - cheatsheet: 암기장 필터 (선택, 부분 일치)
 * - additional_info: 추가 자료 필터 (선택, 부분 일치)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 모든 컬럼 필터 파라미터 추출
    const importance = searchParams.get('importance');
    const category_l1 = searchParams.get('category_l1');
    const category_l2 = searchParams.get('category_l2');
    const category_l3 = searchParams.get('category_l3');
    const topic = searchParams.get('topic');
    const topics_eng = searchParams.get('topics_eng');
    const topics_loc = searchParams.get('topics_loc');
    const parent_topic = searchParams.get('parent_topic');
    const child_topic = searchParams.get('child_topic');
    const definition = searchParams.get('definition');
    const cheatsheet = searchParams.get('cheatsheet');
    const additional_info = searchParams.get('additional_info');
    
    // 기본 쿼리: 모든 토픽을 카테고리 순으로 조회
    // SELECT * FROM topics WHERE 1=1 ORDER BY category_l1, category_l2
    let query = `
      SELECT * FROM topics 
      WHERE 1=1 
    `;
    const values: any[] = [];
    let paramIndex = 1;

    // 중요도 필터 추가
    if (importance) {
      query += ` AND importance = $${paramIndex++}`;
      values.push(importance);
    }

    // 대분류 필터 추가
    if (category_l1) {
      query += ` AND category_l1 = $${paramIndex++}`;
      values.push(category_l1);
    }

    // 중분류 필터 추가
    if (category_l2) {
      query += ` AND category_l2 = $${paramIndex++}`;
      values.push(category_l2);
    }

    // 소분류 필터 추가
    if (category_l3) {
      query += ` AND category_l3 = $${paramIndex++}`;
      values.push(category_l3);
    }

    // 토픽 이름 필터 추가
    if (topic) {
      query += ` AND topic = $${paramIndex++}`;
      values.push(topic);
    }

    // 영문명 필터 추가
    if (topics_eng) {
      query += ` AND topics_eng = $${paramIndex++}`;
      values.push(topics_eng);
    }

    // 한글명 필터 추가
    if (topics_loc) {
      query += ` AND topics_loc = $${paramIndex++}`;
      values.push(topics_loc);
    }

    // 상위 토픽 필터 추가
    if (parent_topic) {
      query += ` AND parent_topic = $${paramIndex++}`;
      values.push(parent_topic);
    }

    // 하위 토픽 필터 추가
    if (child_topic) {
      query += ` AND child_topic = $${paramIndex++}`;
      values.push(child_topic);
    }

    // 정의 필터 추가 (부분 일치)
    if (definition) {
      query += ` AND definition ILIKE $${paramIndex++}`;
      values.push(`%${definition}%`);
    }

    // 암기장 필터 추가 (부분 일치)
    if (cheatsheet) {
      query += ` AND cheatsheet ILIKE $${paramIndex++}`;
      values.push(`%${cheatsheet}%`);
    }

    // 추가 자료 필터 추가 (부분 일치)
    if (additional_info) {
      query += ` AND additional_info ILIKE $${paramIndex++}`;
      values.push(`%${additional_info}%`);
    }

    // 정렬 추가 (ORDER BY)
    query += ` ORDER BY category_l1, category_l2`;

    // 바인드 변수를 실제 값으로 치환한 쿼리 생성 (콘솔 출력용)
    // 역순으로 치환하여 $10이 $1보다 먼저 치환되도록 함
    let queryWithValues = query;
    for (let i = values.length - 1; i >= 0; i--) {
      const placeholder = `$${i + 1}`;
      const value = values[i];
      
      // 문자열 값은 따옴표로 감싸기, NULL 처리
      let formattedValue: string;
      if (value === null || value === undefined) {
        formattedValue = 'NULL';
      } else if (typeof value === 'string') {
        // SQL 인젝션 방지를 위해 작은따옴표 이스케이프
        formattedValue = `'${value.replace(/'/g, "''")}'`;
      } else if (typeof value === 'number') {
        formattedValue = String(value);
      } else {
        formattedValue = String(value);
      }
      
      queryWithValues = queryWithValues.replace(new RegExp(`\\$${i + 1}\\b`, 'g'), formattedValue);
    }

    // 실행될 쿼리를 콘솔에 출력 (바인드 변수 치환된 상태)
    console.log('=== 실행될 쿼리 ===');
    console.log('Query (바인드 변수 포함):', query.trim().replace(/\s+/g, ' '));
    console.log('Query (값 치환됨):', queryWithValues.trim().replace(/\s+/g, ' '));
    console.log('Values:', values);
    console.log('==================');

    // 쿼리 실행
    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

