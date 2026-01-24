'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Plus, ArrowLeft, Upload, FileSpreadsheet, Save, FileUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { saveTopic, saveTopics } from '../actions/topics';
import TabulatorGrid, { TabulatorGridRef } from '@/common/components/TabulatorGrid';
import "tabulator-tables/dist/css/tabulator.min.css";
import { useTheme } from '@/common/hooks/useTheme';
import * as XLSX from 'xlsx';

export default function InputPage() {
  const [viewMode, setViewMode] = useState<'single' | 'bulk'>('single'); // 'single' 또는 'bulk'
  const [saving, setSaving] = useState(false);
  const [gridData, setGridData] = useState<any[]>([]);
  const [parseError, setParseError] = useState<string>('');
  const bulkGridRef = useRef<TabulatorGridRef>(null);
  const { theme } = useTheme();

  // 엑셀 파일 업로드 및 파싱
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError('');
    setGridData([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // 엑셀 데이터를 JSON으로 변환 (헤더 포함)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false }) as any[][];
      
      if (jsonData.length < 3) {
        setParseError('엑셀 파일에 데이터가 없습니다. 헤더 2행과 최소 1행의 데이터가 필요합니다.');
        return;
      }

      // 헤더 2행 제거 (첫 번째 행: 영어 필드명, 두 번째 행: 한국어 필드명)
      // 실제 데이터는 3행부터 시작
      const dataRows = jsonData.slice(2);
      
      const parsed: any[] = [];
      const errors: string[] = [];
      
      // 병합된 셀 처리를 위한 이전 값 추적
      let lastCategoryL1 = '';
      let lastCategoryL2 = '';

      dataRows.forEach((row, index) => {
        // 빈 행 스킵 (모든 셀이 비어있는 경우)
        if (!row || row.every((cell: any) => !cell || cell === '' || cell === null || cell === undefined)) {
          return;
        }

        // 컬럼 순서: A=importance, B=category_l1, C=category_l2, D=topic, E=topics_eng, F=topics_loc, G=child_topic, H=definition, I=cheatsheet, J=additional_info
        const importance = row[0]?.toString().trim() || '';
        // 병합된 셀 처리: 값이 있으면 사용, 없으면 이전 행의 값 사용
        let category_l1 = row[1]?.toString().trim() || '';
        if (!category_l1 && lastCategoryL1) {
          category_l1 = lastCategoryL1;
        } else if (category_l1) {
          lastCategoryL1 = category_l1;
        }
        
        let category_l2 = row[2]?.toString().trim() || '';
        if (!category_l2 && lastCategoryL2) {
          category_l2 = lastCategoryL2;
        } else if (category_l2) {
          lastCategoryL2 = category_l2;
        }
        
        const topic = row[3]?.toString().trim() || '';
        const topics_eng = row[4]?.toString().trim() || '';
        const topics_loc = row[5]?.toString().trim() || '';
        const child_topic = row[6]?.toString().trim() || '';
        const definition = row[7]?.toString().trim() || '';
        const cheatsheet = row[8]?.toString().trim() || '';
        const additional_info = row[9]?.toString().trim() || '';

        // 필수 필드 검증 (중요도, 대분류, 토픽)
        // 실제 엑셀 행 번호는 헤더 2행 + 인덱스 + 1
        const excelRowNumber = index + 3;
        if (!importance || !category_l1 || !topic) {
          errors.push(`행 ${excelRowNumber}: 필수 항목(중요도, 대분류, 토픽)이 누락되었습니다`);
          return;
        }

        // 중요도 검증
        if (!['상', '중', '하'].includes(importance)) {
          errors.push(`행 ${excelRowNumber}: 중요도는 '상', '중', '하' 중 하나여야 합니다 (현재 값: "${importance}")`);
          return;
        }

        // 임시 ID 생성 (그리드 표시용)
        const rowId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

        parsed.push({
          id: rowId, // Tabulator용 임시 ID
          importance,
          category_l1,
          category_l2: category_l2 || '',
          category_l3: '',
          topic,
          parent_topic: '',
          child_topic,
          definition,
          cheatsheet,
          additional_info,
          topics_eng,
          topics_loc,
        });
      });

      if (errors.length > 0) {
        setParseError(errors.join('\n'));
      }

      if (parsed.length > 0) {
        // 그리드에 데이터 추가
        setGridData(parsed);
        
        // 테이블에 데이터 추가 (약간의 지연을 두어 DOM이 준비되도록)
        setTimeout(() => {
          const table = bulkGridRef.current?.getTable();
          if (table) {
            table.setData(parsed);
            // 데이터 로드 후 강제로 리렌더링
            table.redraw(true);
            console.log('엑셀 데이터 로드 완료:', parsed.length, '개');
          }
        }, 100);
      }
    } catch (error) {
      console.error('엑셀 파일 읽기 오류:', error);
      setParseError('엑셀 파일을 읽는 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    }

    // 파일 input 초기화
    e.target.value = '';
  };

  const [formData, setFormData] = useState({
    topic: '',
    topics_eng: '',
    topics_loc: '',
    importance: '',
    category_l1: '',
    category_l2: '',
    category_l3: '',
    parent_topic: '',
    child_topic: '',
    definition: '',
    cheatsheet: '',
    additional_info: '',
  });



  // 엑셀 데이터 파싱 및 그리드에 추가
  const parseAndAddToGrid = (data: string, insertPosition?: number) => {
    try {
      const lines = data.trim().split(/\r?\n/).filter(line => line.trim());
      if (lines.length === 0) {
        setParseError('데이터가 없습니다.');
        return;
      }

      const parsed: any[] = [];
      const errors: string[] = [];

      lines.forEach((line, index) => {
        const columns = line.split('\t').map(col => col.trim());
        
        // 컬럼 순서: importance, category_l1, category_l2, topic, topics_eng, topics_loc, child_topic, definition, cheatsheet, additional_info
        // 최소 컬럼 수는 필수값 importance, category_l1, topic 포함해야 함
        if (columns.length < 3) {
          const importance = columns[0] || '';
          const category_l1 = columns[1] || '';
          const topic = columns[3] || '';
          
          if (!importance || !category_l1 || !topic) {
            errors.push(`행 ${index + 1}: 필수 항목(중요도, 대분류, 토픽)이 누락되었습니다`);
            return;
          }
        }

        const importance = columns[0] || '';
        const category_l1 = columns[1] || '';
        const category_l2 = columns[2] || '';
        const topic = columns[3] || '';
        const topics_eng = columns[4] || '';
        const topics_loc = columns[5] || '';
        const child_topic = columns[6] || '';
        const definition = columns[7] || '';
        const cheatsheet = columns[8] || '';
        const additional_info = columns[9] || '';

        // 필수 필드 검증 (중요도, 대분류, 토픽)
        if (!importance || !category_l1 || !topic) {
          errors.push(`행 ${index + 1}: 필수 항목(중요도, 대분류, 토픽)이 누락되었습니다`);
          return;
        }

        // 중요도 검증
        if (!['상', '중', '하'].includes(importance)) {
          errors.push(`행 ${index + 1}: 중요도는 '상', '중', '하' 중 하나여야 합니다 (현재 값: "${importance}")`);
          return;
        }

        // 임시 ID 생성 (그리드 표시용)
        const rowId = Date.now().toString() + Math.random().toString(36).substr(2, 9) + index;

        const rowData = {
          id: rowId, // Tabulator용 임시 ID
          importance: importance || '중',
          category_l1,
          category_l2,
          category_l3: '',
          topic,
          parent_topic: '',
          child_topic,
          definition,
          cheatsheet,
          additional_info,
          topics_eng,
          topics_loc,
        };

        parsed.push(rowData);
      });

      if (errors.length > 0) {
        setParseError(errors.join('\n'));
      } else {
        setParseError('');
      }

      // 그리드에 데이터 추가
      if (parsed.length > 0) {
        const table = bulkGridRef.current?.getTable();
        if (table) {
          // 그리드에 행 추가
          parsed.forEach((row) => {
            table.addRow(row, false);
          });
          
          // 그리드 데이터 동기화 (약간의 지연을 두어 Tabulator가 먼저 업데이트되도록)
          setTimeout(() => {
            const currentData = table.getData();
            setGridData(currentData);
          }, 100);
        } else {
          // 테이블이 아직 생성되지 않았으면 상태만 업데이트
          setGridData(prev => {
            const updated = [...prev, ...parsed];
            return updated;
          });
        }
      }
    } catch (error) {
      setParseError('데이터 파싱 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    }
  };

  // 그리드 붙여넣기 핸들러
  const handleGridPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    if (pastedText) {
      parseAndAddToGrid(pastedText);
    }
  };

  // 단건 입력 폼 초기화
  const resetForm = () => {
    setFormData({
      topic: '',
      topics_eng: '',
      topics_loc: '',
      importance: '',
      category_l1: '',
      category_l2: '',
      category_l3: '',
      parent_topic: '',
      child_topic: '',
      definition: '',
      cheatsheet: '',
      additional_info: '',
    });
  };

  // 단건 저장
  const handleSingleSave = async () => {
    if (!formData.topic.trim() || !formData.category_l1.trim() || !formData.importance) {
      alert('필수 항목(약어, 대분류, 중요도)을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      const itemData = {
        importance: formData.importance,
        category_l1: formData.category_l1.trim(),
        category_l2: formData.category_l2.trim() || undefined,
        category_l3: formData.category_l3.trim() || undefined,
        topic: formData.topic.trim(),
        parent_topic: formData.parent_topic.trim() || undefined,
        child_topic: formData.child_topic.trim() || undefined,
        definition: formData.definition.trim() || undefined,
        cheatsheet: formData.cheatsheet.trim() || undefined,
        additional_info: formData.additional_info.trim() || undefined,
        topics_eng: formData.topics_eng.trim() || undefined,
        topics_loc: formData.topics_loc.trim() || undefined,
      };

      const result = await saveTopic(itemData);
      
      if (result.success) {
        resetForm();
        alert('저장되었습니다.');
      } else {
        alert(`저장 실패: ${result.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error saving topic:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 엑셀 데이터 일괄 저장
  const handleBulkSave = async () => {
    if (gridData.length === 0) {
      alert('저장할 데이터가 없습니다.');
      return;
    }

    // 필수 필드 검증
    const invalidRows = gridData.filter((row, index) => !row.topic || !row.importance || !row.category_l1);
    if (invalidRows.length > 0) {
      alert(`${invalidRows.length}개의 행에 필수 항목(약어, 중요도, 대분류)이 누락되었습니다.`);
      return;
    }

    setSaving(true);
    try {
      // 그리드 데이터를 저장 형식으로 변환
      const dataToSave = gridData.map(row => ({
        importance: row.importance || '중',
        category_l1: row.category_l1 || '',
        category_l2: row.category_l2 || '',
        category_l3: row.category_l3 || '',
        topic: row.topic || '',
        parent_topic: row.parent_topic || '',
        child_topic: row.child_topic || '',
        definition: row.definition || '',
        cheatsheet: row.cheatsheet || '',
        additional_info: row.additional_info || '',
        topics_eng: row.topics_eng || '',
        topics_loc: row.topics_loc || '',
      }));

      // 서버 액션 호출하여 DB에 일괄 저장
      const result = await saveTopics(dataToSave);
      
      if (result.success) {
        // 초기화
        setGridData([]);
        setParseError('');
        const table = bulkGridRef.current?.getTable();
        if (table) {
          table.clearData();
        }
        alert(`${dataToSave.length}개의 항목이 저장되었습니다.`);
      } else {
        alert(`저장 실패: ${result.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error saving topics:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const router = useRouter();

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="relative z-10 min-h-[calc(100vh-64px)] p-3">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="p-3 rounded-full transition-colors border backdrop-blur-sm"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-card)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <div>
            <h1 
              className="text-3xl font-bold mb-0"
              style={{ color: 'var(--text-primary)' }}
            >
              토픽 자료 입력
            </h1>
          </div>
        </div>

        <div className="w-[95%] mx-auto px-6 pt-1 pb-6">
          {/* 모드 전환 버튼 */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'single' ? 'default' : 'outline'}
              onClick={() => setViewMode('single')}
            >
              단건 입력
            </Button>
            <Button
              variant={viewMode === 'bulk' ? 'default' : 'outline'}
              onClick={() => setViewMode('bulk')}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              일괄 추가
            </Button>
          </div>

          {/* 단건 입력 화면 */}
          {viewMode === 'single' && (
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-card)' }}>
                  {/* 토픽 그룹 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-primary)' }}></div>
                      <span className="text-2xl font-semibold px-4" style={{ color: 'var(--text-secondary)' }}>토 픽</span>
                      <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-primary)' }}></div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <Input
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        placeholder="약어 *"
                    className={!formData.topic.trim() ? 'border-red-500' : ''}
                      />
                      <Input
                        value={formData.topics_eng}
                        onChange={(e) => setFormData({ ...formData, topics_eng: e.target.value })}
                        placeholder="영문명"
                      />
                      <Input
                        value={formData.topics_loc}
                        onChange={(e) => setFormData({ ...formData, topics_loc: e.target.value })}
                        placeholder="한글명"
                      />
                      <Input
                        value={formData.child_topic}
                        onChange={(e) => setFormData({ ...formData, child_topic: e.target.value })}
                    placeholder="하위토픽"
                      />
                    </div>
                  </div>
                  
                  {/* 분류 그룹 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-primary)' }}></div>
                      <span className="text-2xl font-semibold px-4" style={{ color: 'var(--text-secondary)' }}>분 류</span>
                      <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-primary)' }}></div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <Select value={formData.importance} onValueChange={(value) => setFormData({ ...formData, importance: value })}>
                        <SelectTrigger className={!formData.importance ? 'border-red-500' : ''}>
                          <SelectValue placeholder="중요도 *" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="상">상</SelectItem>
                          <SelectItem value="중">중</SelectItem>
                          <SelectItem value="하">하</SelectItem>
                        </SelectContent>
                      </Select>
                  <Input
                    value={formData.category_l1}
                    onChange={(e) => setFormData({ ...formData, category_l1: e.target.value })}
                    placeholder="대분류 *"
                    className={!formData.category_l1.trim() ? 'border-red-500' : ''}
                  />
                  <Input
                        value={formData.category_l2} 
                    onChange={(e) => setFormData({ ...formData, category_l2: e.target.value })}
                    placeholder="중분류"
                  />
                      <Input
                        value={formData.category_l3}
                        onChange={(e) => setFormData({ ...formData, category_l3: e.target.value })}
                        placeholder="소분류"
                      />
                    </div>
                  </div>

                  {/* 토픽 정의, 암기용 요약 정보 */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Textarea
                      value={formData.definition}
                      onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                  placeholder="정의"
                      rows={3}
                    />
                    <Textarea
                      value={formData.cheatsheet}
                      onChange={(e) => setFormData({ ...formData, cheatsheet: e.target.value })}
                      placeholder="두음"
                      rows={3}
                    />
                  </div>

                  {/* 토픽 설명 */}
                  <div className="mb-4">
                    <Textarea
                      value={formData.additional_info}
                      onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                  placeholder="설명"
                      rows={10}
                    />
                  </div>

                  <div className="flex gap-2">
                <Button 
                  onClick={handleSingleSave}
                  disabled={!formData.category_l1.trim() || !formData.importance || !formData.topic.trim() || saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                          {saving ? '저장 중...' : '저장'}
                        </Button>
                      <Button 
                  variant="outline"
                  onClick={resetForm}
                      >
                  초기화
                      </Button>
              </div>
            </div>
          )}

          {/* 일괄 추가 화면 */}
          {viewMode === 'bulk' && (
          <div className="flex-1 flex flex-col">
            <div className="p-2 rounded-lg border" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-card)' }}>
              <div className="mb-2">
                  <TabulatorGrid
                    ref={bulkGridRef}
                    data={gridData}
                    columns={[
                      { 
                        title: '중요도', 
                        field: 'importance', 
                        editor: 'list',
                        editorParams: { 
                          values: { '상': '상', '중': '중', '하': '하' },
                          allowEmpty: false,
                          defaultValue: '중'
                        },
                        width: 80 
                      },
                      { title: '대분류', field: 'category_l1', width: 120 },
                      { title: '중분류', field: 'category_l2', width: 120 },
                      { title: '토픽', field: 'topic', width: 120 },
                      { title: '영문명', field: 'topics_eng', width: 150 },
                      { title: '한글명', field: 'topics_loc', width: 150 },
                      { title: '관련토픽', field: 'child_topic', width: 120 },
                      { title: '정의', field: 'definition', editor: 'textarea', width: 200 },
                      { title: '암기장', field: 'cheatsheet', width: 100 },
                      { title: '추가 자료', field: 'additional_info', editor: 'textarea', width: 250 },
                    ]}
                    showFooter={false}
                    pagination={false}
                    enableClipboard={false}
                    enableCellSelection={false}
                    additionalOptions={{
                      height: 'calc(100vh - 360px)',
                      layout: 'fitDataStretch',
                      virtualDom: true,
                      virtualDomBuffer: 300,
                      editTriggerEvent: "dblclick",
                      editorEmptyValue: undefined,
                      editable: true,
                      dataLoaded: function(data: any[]) {
                        console.log('그리드 데이터 로드 완료:', data.length, '개');
                      },
                      cellEdited: function(cell: any) {
                        const table = bulkGridRef.current?.getTable();
                        if (table) {
                          const currentData = (table as any).getData();
                          setGridData(currentData);
                        }
                      },
                    }}
                    theme={theme}
                    className="w-full"
                  />
                </div>

                {parseError && (
                  <div className="mb-2 p-2 rounded border text-xs" style={{ 
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    color: 'var(--text-primary)'
                  }}>
                    <p className="font-semibold mb-1">오류:</p>
                    <pre className="text-xs whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                      {parseError}
                    </pre>
                  </div>
                )}

                {gridData.length > 0 && !parseError && (
                  <div className="mb-1 p-1.5 rounded border text-xs" style={{ 
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                    color: 'var(--text-primary)'
                  }}>
                    <p className="font-semibold">
                      ✓ {gridData.length}개 준비
                    </p>
                  </div>
                )}

              {/* 버튼 영역 */}
              <div className="mt-1 flex gap-2">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  id="excel-upload"
                  className="hidden"
                  onChange={handleExcelUpload}
                />
                <Button
                  onClick={() => document.getElementById('excel-upload')?.click()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FileUp className="w-4 h-4" />
                  엑셀 파일 업로드
                </Button>
                <Button 
                  onClick={handleBulkSave}
                  disabled={gridData.length === 0 || saving || !!parseError}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {saving ? '저장 중...' : `${gridData.length > 0 ? gridData.length + '개 ' : ''}일괄 저장`}
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setGridData([]);
                    setParseError('');
                    const table = bulkGridRef.current?.getTable();
                    if (table) {
                      table.clearData();
                    }
                  }}
                  disabled={gridData.length === 0}
                >
                  초기화
                </Button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

