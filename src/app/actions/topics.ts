'use server';

import pool from '@/global/lib/db';
import { StudyItem } from '../types';

// 토픽 저장 서버 액션
export async function saveTopic(item: Omit<StudyItem, 'id' | 'no'>) {
  try {
        const query = `
          INSERT INTO topics (
            importance,
            category_l1,
            category_l2,
            category_l3,
            topic,
            topics_eng,
            topics_loc,
            parent_topic,
            child_topic,
            definition,
            cheatsheet,
            additional_info
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING id
        `;

        const values = [
          item.importance,
          item.category_l1,
          item.category_l2 || null,
          item.category_l3 || null,
          item.topic,
          item.topics_eng || null,
          item.topics_loc || null,
          item.parent_topic || null,
          item.child_topic || null,
          item.definition || null,
          item.cheatsheet || null,
          item.additional_info || null,
        ];

    const result = await pool.query(query, values);
    
    return {
      success: true,
      id: result.rows[0].id,
    };
  } catch (error) {
    console.error('Error saving topic:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 여러 토픽 일괄 저장
export async function saveTopics(items: Omit<StudyItem, 'id' | 'no'>[]) {
  try {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const results = [];
      for (const item of items) {
        const query = `
          INSERT INTO topics (
            importance,
            category_l1,
            category_l2,
            category_l3,
            topic,
            topics_eng,
            topics_loc,
            parent_topic,
            child_topic,
            definition,
            cheatsheet,
            additional_info
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING id
        `;

        const values = [
          item.importance,
          item.category_l1,
          item.category_l2 || null,
          item.category_l3 || null,
          item.topic,
          item.topics_eng || null,
          item.topics_loc || null,
          item.parent_topic || null,
          item.child_topic || null,
          item.definition || null,
          item.cheatsheet || null,
          item.additional_info || null,
        ];

        const result = await client.query(query, values);
        results.push(result.rows[0].id);
      }
      
      await client.query('COMMIT');
      
      return {
        success: true,
        ids: results,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error saving topics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 토픽 업데이트
export async function updateTopic(id: number, item: Partial<Omit<StudyItem, 'id' | 'no'>>) {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (item.importance !== undefined) {
      fields.push(`importance = $${paramIndex++}`);
      values.push(item.importance);
    }
    if (item.category_l1 !== undefined) {
      fields.push(`category_l1 = $${paramIndex++}`);
      values.push(item.category_l1);
    }
    if (item.category_l2 !== undefined) {
      fields.push(`category_l2 = $${paramIndex++}`);
      values.push(item.category_l2);
    }
    if (item.category_l3 !== undefined) {
      fields.push(`category_l3 = $${paramIndex++}`);
      values.push(item.category_l3);
    }
    if (item.topic !== undefined) {
      fields.push(`topic = $${paramIndex++}`);
      values.push(item.topic);
    }
    if (item.topics_eng !== undefined) {
      fields.push(`topics_eng = $${paramIndex++}`);
      values.push(item.topics_eng);
    }
    if (item.topics_loc !== undefined) {
      fields.push(`topics_loc = $${paramIndex++}`);
      values.push(item.topics_loc);
    }
    if (item.parent_topic !== undefined) {
      fields.push(`parent_topic = $${paramIndex++}`);
      values.push(item.parent_topic);
    }
    if (item.child_topic !== undefined) {
      fields.push(`child_topic = $${paramIndex++}`);
      values.push(item.child_topic);
    }
    if (item.definition !== undefined) {
      fields.push(`definition = $${paramIndex++}`);
      values.push(item.definition);
    }
    if (item.cheatsheet !== undefined) {
      fields.push(`cheatsheet = $${paramIndex++}`);
      values.push(item.cheatsheet);
    }
    if (item.additional_info !== undefined) {
      fields.push(`additional_info = $${paramIndex++}`);
      values.push(item.additional_info);
    }

    if (fields.length === 0) {
      return { success: false, error: 'No fields to update' };
    }

    values.push(id);
    const query = `
      UPDATE topics
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id
    `;

    const result = await pool.query(query, values);
    
    return {
      success: true,
      id: result.rows[0].id,
    };
  } catch (error) {
    console.error('Error updating topic:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 토픽 삭제
export async function deleteTopic(id: number) {
  try {
    const query = 'DELETE FROM topics WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    
    return {
      success: true,
      id: result.rows[0]?.id,
    };
  } catch (error) {
    console.error('Error deleting topic:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 최대 ID 조회
export async function getMaxId() {
  try {
    const query = 'SELECT COALESCE(MAX(id), 0) as max_id FROM topics';
    const result = await pool.query(query);
    
    return {
      success: true,
      maxId: parseInt(result.rows[0]?.max_id || '0', 10),
    };
  } catch (error) {
    console.error('Error getting max id:', error);
    return {
      success: false,
      maxId: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
