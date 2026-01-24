'use client';

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";
import { DateTime } from "luxon";

// Tabulator 인터페이스 확장 (on/off 메소드 정의)
declare module 'tabulator-tables' {
  interface Tabulator {
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
  }
}

// 타입 정의
export interface DataType {
  [key: string]: any;
}

export interface RowComponent {
  getData(): any;
  getElement(): HTMLElement;
  getCells(): CellComponent[];
  getCell(column: string): CellComponent;
  select(): void;
  deselect(): void;
  toggleSelect(): void;
  isSelected(): boolean;
}

export interface CellComponent {
  getValue(): any;
  getElement(): HTMLElement;
  getRow(): RowComponent;
  getField(): string;
}

export interface ColumnDefinitionType {
  title: string;
  field?: string;
  formatter?: string | Function;
  formatterParams?: any;
  headerSort?: boolean;
  sorter?: string | Function;
  width?: number | string;
  hozAlign?: string;
  vertAlign?: string;
  frozen?: boolean;
  headerHozAlign?: string;
  cssClass?: string;
  headerFilter?: boolean;
  titleFormatter?: string | Function;
  resizable?: boolean;
  [key: string]: any;
}

export interface TabulatorGridProps {
  data: DataType[];
  columns: ColumnDefinitionType[];
  height?: string;
  minHeight?: string;
  layout?: string;
  pagination?: boolean;
  paginationSize?: number;
  paginationSizeSelector?: number[];
  movableColumns?: boolean;
  selectable?: boolean;
  selectableRollingSelection?: boolean;
  enableCellSelection?: boolean; // 셀 선택 활성화
  enableClipboard?: boolean; // 클립보드 기능 활성화
  showSelectionControls?: boolean; // 선택 컨트롤 표시 여부
  enableCellSelectionOnRowSelect?: boolean; // 행 선택 시 셀 선택 초기화 여부
  showFooter?: boolean; // 푸터(상태바) 표시 여부
  onRowSelected?: (row: RowComponent) => void;
  onRowDeselected?: (row: RowComponent) => void;
  onSelectionChanged?: (message: string) => void;
  onCopySuccess?: (message: string) => void;
  onCellClick?: (e: Event, cell: CellComponent) => void;
  className?: string;
  theme?: 'light' | 'dark'; // 테마 지원 추가
  additionalOptions?: Record<string, any>;
}

// Ref를 통해 외부에서 접근 가능한 메서드 정의
export interface TabulatorGridRef {
  getTable: () => Tabulator | null;
  clearSelection: () => void;
  copySelection: () => void;
  clearHeaderFilter: () => void;
  setHeaderFilterValue: (field: string, value: any) => void;
}

// 컴포넌트 구현
const TabulatorGrid = forwardRef<TabulatorGridRef, TabulatorGridProps>((props, ref) => {
  const {
    data,
    columns,
    height,
    minHeight,
    layout = "fitColumns",
    pagination = true,
    paginationSize = 20,
    paginationSizeSelector = [5, 10, 20, 50, 100],
    movableColumns = true,
    selectable = true,
    selectableRollingSelection = false,
    enableCellSelection = true,
    enableClipboard = true,
    showSelectionControls = true,
    enableCellSelectionOnRowSelect = true,
    showFooter = true,
    onRowSelected,
    onRowDeselected,
    onSelectionChanged,
    onCopySuccess,
    onCellClick,
    className = "",
    theme = 'light',
    additionalOptions = {}
  } = props;

  // Refs
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorRef = useRef<Tabulator | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // State - 최소한의 상태만 유지
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | "all">("all");
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [displayedData, setDisplayedData] = useState<DataType[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  
  // 선택 관련 state
  const selectedCells = useRef<HTMLElement[]>([]);
  const selectedRows = useRef<Set<string>>(new Set());
  
  // 드래그 및 선택 관련 변수
  const isDragging = useRef<boolean>(false);
  const startCell = useRef<HTMLElement | null>(null);
  const lastSelectedCell = useRef<HTMLElement | null>(null);
  const shiftStartCell = useRef<HTMLElement | null>(null);

  // 데이터 상태 정보
  const [dataStats, setDataStats] = useState<{total: number, filtered: number, selected: number, categoryCounts: Record<string, number>}>({
    total: data.length,
    filtered: data.length,
    selected: 0,
    categoryCounts: {}
  });

  // 페이지네이션된 데이터 계산
  const getPaginatedData = () => {
    if (pageSize === "all") {
      return data; // 전체 데이터 반환
    }
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  // 페이지네이션 업데이트
  const updatePagination = () => {
    const paginatedData = getPaginatedData();
    setDisplayedData(paginatedData);
    
    if (tabulatorRef.current) {
      tabulatorRef.current.replaceData(paginatedData);
    }
  };

  // 이전 데이터 참조 저장 (실제 변경 감지용)
  const prevDataRef = useRef<DataType[]>([]);
  
  // 데이터가 실제로 변경되었는지 확인 (ID 기반 비교)
  const isDataChanged = useMemo(() => {
    if (prevDataRef.current.length !== data.length) {
      prevDataRef.current = data;
      return true;
    }
    // ID 기반으로 변경 감지
    const prevIds = new Set(prevDataRef.current.map((row: any) => row.id));
    const currentIds = new Set(data.map((row: any) => row.id));
    if (prevIds.size !== currentIds.size) {
      prevDataRef.current = data;
      return true;
    }
    // Array.from()을 사용하여 Set을 배열로 변환 후 반복
    const currentIdsArray = Array.from(currentIds);
    for (let i = 0; i < currentIdsArray.length; i++) {
      if (!prevIds.has(currentIdsArray[i])) {
        prevDataRef.current = data;
        return true;
      }
    }
    // 데이터가 실제로 변경되지 않았으면 false 반환
    return false;
  }, [data]);

  // 페이지 변경 시 데이터 업데이트 (pagination이 true일 때만)
  useEffect(() => {
    if (pagination && pageSize !== "all") {
      updatePagination();
    } else {
      // pagination이 false이거나 "all"일 때는 전체 데이터를 직접 업데이트
      // 단, 데이터가 실제로 변경되었을 때만 업데이트 (필터/정렬 상태 보존)
      if (tabulatorRef.current && isDataChanged) {
        tabulatorRef.current.replaceData(data);
      }
    }
  }, [currentPage, pageSize, isDataChanged, pagination]);

  // 데이터가 변경될 때 통계 업데이트
  useEffect(() => {
    updateDataStats();
  }, [data]);

  // 데이터 상태 업데이트 함수
  const updateDataStats = () => {
    if (!tabulatorRef.current) return;
    
    try {
      // 전체 데이터 수
      const totalData = data.length;
      
      // 필터링된 데이터 수 가져오기
      let filteredDataCount = totalData;
      try {
        if (typeof (tabulatorRef.current as any).getRows === 'function') {
          const filteredRows = (tabulatorRef.current as any).getRows('active');
          filteredDataCount = filteredRows ? filteredRows.length : totalData;
        }
      } catch (e) {
        // 필터링된 데이터를 가져올 수 없으면 전체 데이터 수 사용
        filteredDataCount = totalData;
      }
      
      // 선택된 데이터 수 (테이블이 초기화되었는지 확인)
      let selectedData = 0;
      try {
        if (typeof (tabulatorRef.current as any).getSelectedData === 'function') {
          selectedData = (tabulatorRef.current as any).getSelectedData().length;
        }
      } catch (e) {
        // 테이블이 아직 초기화되지 않았을 수 있음
        selectedData = 0;
      }
      
      // 필터링된 데이터에서 대분류별 개수 계산
      const categoryCounts: Record<string, number> = {};
      try {
        if (typeof (tabulatorRef.current as any).getRows === 'function') {
          const filteredRows = (tabulatorRef.current as any).getRows('active');
          if (filteredRows && filteredRows.length > 0) {
            filteredRows.forEach((row: any) => {
              const rowData = row.getData();
              if (rowData) {
                const category = rowData.category_l1 || '미분류';
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
              }
            });
          } else {
            // 필터링된 데이터가 없으면 전체 데이터로 계산
            data.forEach((item: any) => {
              const category = item.category_l1 || '미분류';
              categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
          }
        } else {
          // getRows가 없으면 전체 데이터로 계산
          data.forEach((item: any) => {
            const category = item.category_l1 || '미분류';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
        }
      } catch (e) {
        // 오류 발생 시 전체 데이터로 계산
        data.forEach((item: any) => {
          const category = item.category_l1 || '미분류';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
      }
      
      setDataStats({
        total: totalData, // 전체 데이터 수
        filtered: filteredDataCount, // 필터링된 데이터 수
        selected: selectedData,
        categoryCounts: categoryCounts
      });
      setSelectedCount(selectedData);

      // 푸터 요소 직접 업데이트
      const totalElement = document.querySelector('.tabulator-footer-data-stats .total-count');
      const selectedElement = document.querySelector('.tabulator-footer-data-stats .selected-count');
      
      if (totalElement) {
        totalElement.textContent = filteredDataCount.toString();
      }
      
      if (selectedElement) {
        selectedElement.textContent = selectedData.toString();
      }
    } catch (e) {
      console.warn("데이터 상태 업데이트 중 오류 발생", e);
    }
  };

  // 외부에서 접근 가능한 메서드 설정
  useImperativeHandle(ref, () => ({
    getTable: () => tabulatorRef.current,
    clearSelection: handleClearSelection,
    copySelection: handleCopySelection,
    clearHeaderFilter: () => {
      if (tabulatorRef.current) {
        tabulatorRef.current.clearHeaderFilter();
      }
    },
    setHeaderFilterValue: (field: string, value: any) => {
      if (tabulatorRef.current) {
        tabulatorRef.current.setHeaderFilterValue(field, value);
      }
    }
  }));

  // 셀 선택 추가
  const addCellSelection = (cell: HTMLElement) => {
    if (!cell.classList.contains('selected-cell')) {
      cell.classList.add('selected-cell');
      if (!selectedCells.current.includes(cell)) {
        selectedCells.current.push(cell);
        onSelectionChanged?.(
          `${selectedCells.current.length}개 셀 선택`
        );
      }
    }
  };
  
  // 셀 선택 토글
  const toggleCellSelection = (cell: HTMLElement) => {
    if (cell.classList.contains('selected-cell')) {
      cell.classList.remove('selected-cell');
      selectedCells.current = selectedCells.current.filter(c => c !== cell);
    } else {
      cell.classList.add('selected-cell');
      selectedCells.current.push(cell);
    }
    onSelectionChanged?.(
      `${selectedCells.current.length}개 셀 선택`
    );
  };
  
  // 셀 선택 해제
  const clearCellSelection = () => {
    document.querySelectorAll('.selected-cell').forEach(cell => {
      cell.classList.remove('selected-cell');
      cell.classList.remove('drag-selected');
    });
    selectedCells.current = [];
    onSelectionChanged?.("셀 선택 해제됨");
  };

  // 셀 영역 선택
  const selectCellRange = (start: HTMLElement, end: HTMLElement) => {
    // 체크박스 열 제외한 모든 셀 가져오기
    const allCells = Array.from(document.querySelectorAll('.tabulator-cell:not([tabulator-field="selected"])'));
    if (!allCells.length) return;
    
    // 시작 셀과 끝 셀의 위치 확인
    const startIndex = allCells.indexOf(start);
    const endIndex = allCells.indexOf(end);
    if (startIndex === -1 || endIndex === -1) return;
    
    // 테이블의 컬럼 수 계산 (체크박스 열 제외)
    const columnCount = document.querySelectorAll('.tabulator-col:not(.tabulator-col-group)').length - 
                       (columns.some(col => col.field === 'selected') ? 1 : 0);
    if (columnCount <= 0) return;
    
    // 시작 셀과 끝 셀의 행/열 인덱스 계산
    const startRowIndex = Math.floor(startIndex / columnCount);
    const startColIndex = startIndex % columnCount;
    const endRowIndex = Math.floor(endIndex / columnCount);
    const endColIndex = endIndex % columnCount;
    
    // 선택 범위 계산
    const minRowIndex = Math.min(startRowIndex, endRowIndex);
    const maxRowIndex = Math.max(startRowIndex, endRowIndex);
    const minColIndex = Math.min(startColIndex, endColIndex);
    const maxColIndex = Math.max(startColIndex, endColIndex);
    
    // 범위 내 모든 셀 선택
    for (let rowIndex = minRowIndex; rowIndex <= maxRowIndex; rowIndex++) {
      for (let colIndex = minColIndex; colIndex <= maxColIndex; colIndex++) {
        const cellIndex = rowIndex * columnCount + colIndex;
        if (cellIndex >= 0 && cellIndex < allCells.length) {
          const cell = allCells[cellIndex] as HTMLElement;
          if (cell) {
            cell.classList.add('selected-cell');
            cell.classList.add('drag-selected');
          }
        }
      }
    }
    
    onSelectionChanged?.(
      `${(maxRowIndex - minRowIndex + 1) * (maxColIndex - minColIndex + 1)}개 셀 선택`
    );
  };

  // 셀 클릭 이벤트 처리
  const handleCellClick = (e: MouseEvent) => {
    if (!enableCellSelection) return;
    
    const target = e.target as HTMLElement;
    
    // 체크박스 열은 무시
    if (target.closest('.tabulator-cell[tabulator-field="selected"]')) {
      if (enableCellSelectionOnRowSelect) {
        clearCellSelection();
      }
      return;
    }
    
    // 일반 셀 클릭
    const cell = target.closest('.tabulator-cell') as HTMLElement | null;
    if (!cell) return;
    
    // 헤더 클릭 무시
    if (cell.closest('.tabulator-header')) return;
    
    // Shift 키: 범위 선택
    if (e.shiftKey && shiftStartCell.current) {
      selectCellRange(shiftStartCell.current, cell);
    }
    // Ctrl 키: 개별 셀 토글
    else if (e.ctrlKey || e.metaKey) {
      toggleCellSelection(cell);
      shiftStartCell.current = cell;
    }
    // 일반 클릭: 새 선택
    else {
      clearCellSelection();
      addCellSelection(cell);
      shiftStartCell.current = cell;
    }
  };
  
  // 마우스 다운 이벤트
  const handleMouseDown = (e: MouseEvent) => {
    if (!enableCellSelection || e.shiftKey) return;
    
    const target = e.target as HTMLElement;
    const cell = target.closest('.tabulator-cell') as HTMLElement;
    
    // 체크박스 컬럼이나 헤더는 무시
    if (!cell || 
        cell.getAttribute('tabulator-field') === 'selected' || 
        cell.closest('.tabulator-header')) return;
    
    // 좌클릭만 처리
    if (e.button !== 0) return;
    
    // 드래그 시작
    isDragging.current = true;
    startCell.current = cell;
    lastSelectedCell.current = cell;
    
    // Ctrl 키 없으면 선택 초기화
    if (!e.ctrlKey && !e.metaKey) {
      clearCellSelection();
    }
    
    // 첫 셀 선택
    addCellSelection(cell);
    
    e.preventDefault();
  };
  
  // 마우스 이동 핸들러 (드래그)
  const handleMouseMove = (e: MouseEvent) => {
    if (!enableCellSelection || !isDragging.current || !startCell.current) return;
    
    // 텍스트 선택 방지
    e.preventDefault();
    
    // 현재 셀 확인
    const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementUnderMouse) return;
    
    const currentCell = elementUnderMouse.closest('.tabulator-cell') as HTMLElement;
    if (!currentCell || 
        currentCell.closest('.tabulator-header') || 
        currentCell.getAttribute('tabulator-field') === 'selected') return;
    
    // 마지막으로 처리한 셀과 같으면 중복 처리 방지
    if (lastSelectedCell.current === currentCell) return;
    lastSelectedCell.current = currentCell;
    
    // 임시 선택된 셀 초기화
    document.querySelectorAll('.drag-selected').forEach(cell => {
      cell.classList.remove('drag-selected');
      if (!selectedCells.current.includes(cell as HTMLElement)) {
        cell.classList.remove('selected-cell');
      }
    });
    
    // 범위 선택
    if (startCell.current) {
      selectCellRange(startCell.current, currentCell);
    }
  };
  
  // 마우스 업 핸들러
  const handleMouseUp = (e: MouseEvent) => {
    if (!enableCellSelection || !isDragging.current) return;
    
    // 드래그 선택된 셀 처리
    const dragSelectedCells = document.querySelectorAll('.drag-selected');
    
    // Ctrl 키 없으면 기존 선택 초기화
    if (!e.ctrlKey && !e.metaKey) {
      selectedCells.current.forEach(cell => {
        if (!cell.classList.contains('drag-selected')) {
          cell.classList.remove('selected-cell');
        }
      });
      selectedCells.current = [];
    }
    
    // 선택 목록에 추가
    dragSelectedCells.forEach(cell => {
      const cellElement = cell as HTMLElement;
      if (!selectedCells.current.includes(cellElement)) {
        selectedCells.current.push(cellElement);
      }
    });
    
    isDragging.current = false;
    onSelectionChanged?.(
      `${selectedCells.current.length}개 셀 선택`
    );
  };
  
  // 키보드 이벤트
  const handleKeyDown = (e: KeyboardEvent) => {
    // spreadsheet 모드가 활성화되어 있으면 Tabulator의 기본 clipboard 기능을 사용하므로 건드리지 않음
    if ((additionalOptions as any)?.spreadsheet === true) {
      // spreadsheet 모드에서는 Tabulator가 모든 clipboard 이벤트를 처리
      return;
    }
    
    // Tabulator 요소 내부의 이벤트는 Tabulator가 처리하도록 허용
    const target = e.target as HTMLElement;
    if (tableRef.current && tableRef.current.contains(target)) {
      // Tabulator의 clipboard 기능이 작동하도록 Ctrl+V는 처리하지 않음
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        return; // Tabulator가 처리하도록 허용
      }
      // Ctrl+C도 Tabulator의 기본 동작을 먼저 확인
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        // 셀이 선택되어 있으면 우리의 커스텀 복사 사용
        if (selectedCells.current.length > 0) {
          e.preventDefault();
          handleCopySelection();
          return;
        }
        // 그 외에는 Tabulator가 처리하도록 허용
        return;
      }
    }
    
    // ESC: 선택 해제
    if (e.key === 'Escape') {
      clearCellSelection();
      if (tabulatorRef.current) {
        tabulatorRef.current.deselectRow();
      }
      selectedRows.current.clear();
      shiftStartCell.current = null;
      onSelectionChanged?.("모든 선택 해제됨");
    }
    // Ctrl+C: 복사 (Tabulator 요소 외부에서)
    else if (enableClipboard && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      // 셀이 선택되어 있으면 우리의 커스텀 복사 사용
      if (selectedCells.current.length > 0) {
        e.preventDefault();
        handleCopySelection();
      }
    }
  };

  // 커스텀 이벤트 핸들러 설정
  const setupCustomHandlers = () => {
    if (!tableRef.current || !enableCellSelection) return;
    
    // spreadsheet 모드가 활성화되어 있으면 커스텀 핸들러를 설정하지 않음
    // Tabulator가 자체 clipboard 기능을 처리하도록 함
    if ((additionalOptions as any)?.spreadsheet === true) {
      return;
    }
    
    // 테이블 요소
    const tableElement = tableRef.current;
    
    // 일반 셀 선택 이벤트
    tableElement.addEventListener('click', handleCellClick);
    tableElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
  };

  // 복사 기능 구현
  const handleCopySelection = () => {
    if (!tabulatorRef.current) return;
    
    // 복사할 데이터
    let copyData: string[][] = [];
    
    try {
      // DOM에서 선택된 행 확인 (체크박스로 선택된 행)
      const selectedRowElements = document.querySelectorAll('.tabulator-row.tabulator-selected');
      
      // 체크박스로 선택된 행이 있는 경우
      if (selectedRowElements.length > 0) {
        // 컬럼 정의에서 체크박스 열 제외
        const visibleColumns = columns.filter(col => col.field !== 'selected');
        
        // 선택된 각 행에서 데이터 수집
        let rows: DataType[] = [];
        
        // DOM에서 직접 행 ID 추출
        selectedRowElements.forEach(rowEl => {
          // data-id 속성 확인
          const rowId = rowEl.getAttribute('data-id');
          
          if (rowId) {
            // 데이터에서 행 찾기
            const rowData = data.find(r => r.id?.toString() === rowId);
            
            if (rowData) {
              rows.push(rowData);
            } else {
              // 추가 시도: Tabulator 인스턴스에서 행 데이터 직접 가져오기
              try {
                // @ts-ignore - Tabulator API에는 getRow가 있지만 타입이 정의되지 않음
                const rowComponent = tabulatorRef.current?.getRow(rowId);
                if (rowComponent) {
                  const directRowData = rowComponent.getData() as DataType;
                  if (directRowData) {
                    rows.push(directRowData);
                  }
                }
              } catch (rowErr) {
                // 오류 발생 시 조용히 실패
              }
            }
          } else {
            // 대체 방법: 행 인덱스로 데이터 찾기 시도
            try {
              const rowIndex = Array.from(document.querySelectorAll('.tabulator-row')).indexOf(rowEl);
              if (rowIndex >= 0 && rowIndex < data.length) {
                rows.push(data[rowIndex]);
              }
            } catch (indexErr) {
              // 오류 발생 시 조용히 실패
            }
          }
        });
        
        // 복사 데이터 생성
        if (rows.length > 0) {
          rows.forEach(rowData => {
            const rowValues = visibleColumns.map(col => {
              const field = col.field;
              if (!field) return '';
              
              const value = rowData[field];
              
              if (field === 'salary' && typeof value === 'number') {
                return `₩${value.toLocaleString()}`;
              }
              
              return value !== null && value !== undefined ? String(value) : '';
            });
            
            copyData.push(rowValues);
          });
        }
      }
      // 선택된 셀이 있는 경우
      else if (selectedCells.current.length > 0) {
        // 행별로 셀 그룹화
        const rowGroups = new Map<HTMLElement, HTMLElement[]>();
        
        selectedCells.current.forEach(cell => {
          const row = cell.closest('.tabulator-row') as HTMLElement;
          if (!row) return;
          
          if (!rowGroups.has(row)) {
            rowGroups.set(row, []);
          }
          rowGroups.get(row)?.push(cell);
        });
        
        // 행 순서대로 정렬
        const allRows = Array.from(document.querySelectorAll('.tabulator-row')) as HTMLElement[];
        const sortedRows = Array.from(rowGroups.keys()).sort((a, b) => {
          return allRows.indexOf(a) - allRows.indexOf(b);
        });
        
        // 각 행 처리
        sortedRows.forEach(row => {
          const cells = rowGroups.get(row) || [];
          const allCellsInRow = Array.from(row.querySelectorAll('.tabulator-cell:not([tabulator-field="selected"])')) as HTMLElement[];
          
          // 정렬
          const sortedCells = cells.sort((a, b) => {
            return allCellsInRow.indexOf(a) - allCellsInRow.indexOf(b);
          });
          
          // 범위 계산
          const cellIndices = sortedCells.map(cell => allCellsInRow.indexOf(cell));
          const minIndex = Math.min(...cellIndices);
          const maxIndex = Math.max(...cellIndices);
          
          // 데이터 추출
          const rowData: string[] = [];
          for (let i = minIndex; i <= maxIndex; i++) {
            const cell = allCellsInRow[i];
            rowData.push(cell?.textContent?.trim() || '');
          }
          
          if (rowData.some(text => text !== '')) {
            copyData.push(rowData);
          }
        });
      }
      
      // 복사할 내용 없으면 종료
      if (copyData.length === 0) {
        onCopySuccess?.("복사할 내용이 없습니다.");
        setCopyStatus("복사할 내용이 없습니다.");
        setTimeout(() => setCopyStatus(""), 2000);
        return;
      }
      
      // 텍스트 생성 (Windows 스타일 줄바꿈)
      const copyText = copyData.map(row => row.join('\t')).join('\r\n');
      
      // 클립보드에 복사
      if (textareaRef.current) {
        textareaRef.current.value = copyText;
        textareaRef.current.style.display = 'block';
        textareaRef.current.focus();
        textareaRef.current.select();
        
        // 복사 시도
        const success = document.execCommand('copy');
        
        if (success) {
          onCopySuccess?.(`${copyData.length}개 행이 복사되었습니다.`);
          setCopyStatus(`${copyData.length}개 행이 복사되었습니다.`);
        } else {
          // 모던 API 시도
          navigator.clipboard.writeText(copyText)
            .then(() => {
              onCopySuccess?.(`${copyData.length}개 행이 복사되었습니다.`);
              setCopyStatus(`${copyData.length}개 행이 복사되었습니다.`);
            })
            .catch(() => {
              setCopyStatus("복사 실패");
            });
        }
        
        textareaRef.current.style.display = 'none';
      }
    } catch (err) {
      setCopyStatus("복사 중 오류 발생");
      setTimeout(() => setCopyStatus(""), 2000);
    }
    
    setTimeout(() => setCopyStatus(""), 2000);
  };
  
  // 선택 초기화
  const handleClearSelection = () => {
    // 셀 선택 초기화
    clearCellSelection();
    
    // 체크박스 선택 초기화
    if (tabulatorRef.current) {
      tabulatorRef.current.deselectRow();
    }
    selectedRows.current.clear();
    
    onSelectionChanged?.("모든 선택이 해제되었습니다.");
    setCopyStatus("모든 선택이 해제되었습니다.");
    setTimeout(() => setCopyStatus(""), 2000);
  };

  // 셀 선택 완전 초기화 (강제 리셋)
  const forceResetAllCellSelection = () => {
    console.log('셀 선택 강제 초기화 실행');
    // 모든 셀 선택 표시 제거
    document.querySelectorAll('.selected-cell, .drag-selected').forEach(cell => {
      cell.classList.remove('selected-cell');
      cell.classList.remove('drag-selected');
    });
    
    // 배열 완전 초기화
    selectedCells.current = [];
    
    // 드래그 관련 상태 초기화
    isDragging.current = false;
    startCell.current = null;
    lastSelectedCell.current = null;
    shiftStartCell.current = null;
  };

  // 체크박스 셀 클릭 핸들러 (단순화)
  const checkboxClickHandler = (e: MouseEvent) => {
    // 셀 선택 초기화 (최우선)
    clearCellSelection();
    forceResetAllCellSelection();
    
    // 체크박스 셀 찾기
    const cell = e.currentTarget as HTMLElement;
    if (!cell) return;
    
    // 행 요소 찾기
    const row = cell.closest('.tabulator-row') as HTMLElement;
    if (!row) return;
    
    // 현재 행의 선택 상태 확인
    const isSelected = row.classList.contains('tabulator-selected');
    
    // 이벤트 전파 중지 (다른 이벤트와 충돌 방지)
    e.stopPropagation();
    
    // 행 선택 상태 토글
    if (isSelected) {
      // 이미 선택된 경우 선택 해제
      if (tabulatorRef.current) {
        tabulatorRef.current.deselectRow(row);
      }
    } else {
      // 선택되지 않은 경우 선택
      if (tabulatorRef.current) {
        tabulatorRef.current.selectRow(row);
      }
    }
  };
  
  // 체크박스 핸들러 설정 (단순화)
  const setupCheckboxHandlers = () => {
    // 지연 후 핸들러 적용
    setTimeout(() => {
      // 체크박스 셀 찾기
      const checkboxCells = document.querySelectorAll('.tabulator-cell[tabulator-field="selected"]');
      
      // 각 셀에 이벤트 핸들러 추가
      checkboxCells.forEach(cell => {
        // 기존 이벤트 리스너 제거
        cell.removeEventListener('click', checkboxClickHandler as any);
        
        // 새 이벤트 리스너 추가
        cell.addEventListener('click', checkboxClickHandler as any);
        
        // 스타일 추가
        (cell as HTMLElement).style.position = 'relative';
        (cell as HTMLElement).style.cursor = 'pointer';
        
        // 전체 영역 클릭 가능하도록 가상 요소 추가
        if (!cell.querySelector('.checkbox-overlay')) {
          const overlay = document.createElement('div');
          overlay.className = 'checkbox-overlay';
          overlay.style.position = 'absolute';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100%';
          overlay.style.height = '100%';
          overlay.style.cursor = 'pointer';
          overlay.style.zIndex = '10';
          
          // 가운데 체크박스 영역은 클릭 이벤트가 통과하도록 함
          const checkbox = cell.querySelector('.tabulator-checkbox');
          if (checkbox) {
            const rect = (checkbox as HTMLElement).getBoundingClientRect();
            const cellRect = (cell as HTMLElement).getBoundingClientRect();
            
            const checkboxWidth = rect.width || 18;
            const checkboxHeight = rect.height || 18;
            
            // 가운데 구멍을 뚫어 체크박스가 정상 동작하도록 함
            overlay.style.background = 'transparent';
            
            // 클릭 이벤트 추가
            overlay.addEventListener('click', (e) => {
              clearCellSelection();
              forceResetAllCellSelection();
              
              // 현재 행의 선택 상태 확인
              const row = cell.closest('.tabulator-row') as HTMLElement;
              if (!row) return;
              
              const isSelected = row.classList.contains('tabulator-selected');
              
              // 행 선택 상태 토글
              if (isSelected) {
                if (tabulatorRef.current) {
                  tabulatorRef.current.deselectRow(row);
                }
              } else {
                if (tabulatorRef.current) {
                  tabulatorRef.current.selectRow(row);
                }
              }
            });
          }
          
          cell.appendChild(overlay);
        }
      });
    }, 100);
  };

  // 테이블 초기화
  useEffect(() => {
    if (tableRef.current) {
      // DateTime을 전역적으로 설정 (luxon 의존성 해결)
      if (typeof window !== 'undefined') {
        (window as any).DateTime = DateTime;
      }
      
      // 테마에 따른 스타일 설정
      const isDark = theme === 'dark';
      
      // Spreadsheet 모드 체크
      const isSpreadsheetMode = (additionalOptions as any)?.spreadsheet === true;
      
      // Tabulator 기본 옵션
      // pagination이 false일 때는 전체 데이터 사용, true일 때는 페이지네이션된 데이터 사용
      const initialData = pagination ? getPaginatedData() : data;
      
      const options = {
        data: initialData,
        columns: columns.map(col => ({
          ...col,
          headerFilter: false // 내장 헤더 필터 비활성화
        })),
        // 사용자가 지정한 경우만 높이 관련 옵션 추가
        ...(height !== undefined ? { height } : {}),
        ...(minHeight !== undefined ? { minHeight } : {}),
        layout: layout,
        pagination: false, // 기본 페이지네이션 비활성화
        paginationSize: paginationSize,
        paginationSizeSelector: paginationSizeSelector,
        movableColumns: movableColumns,
        // Spreadsheet 모드에서는 행 선택 비활성화 (범위 선택만 사용)
        selectable: isSpreadsheetMode ? false : selectable,
        selectableRollingSelection: isSpreadsheetMode ? false : selectableRollingSelection,
        // 테마 설정
        theme: theme,
        
        // 컬럼 크기 조정 및 이동 이벤트 처리
        columnResized: function() {
          // 필터 관련 로직 제거
        },
        
        columnMoved: function() {
          // 필터 관련 로직 제거
        },
        
        // 테두리 설정
        renderHorizontal: "basic",
        renderVertical: "basic",
        
        // 빈 공간 설정
        placeholder: "데이터가 없습니다.",
        placeholderBackground: isDark ? "#1f2937" : "white",
        
        // 푸터 완전히 제거
        footerElement: false,
        
        // 행 선택 이벤트
        rowSelected: function(row: any) {
          // 행이 선택될 때마다 ID를 selectedRows에 추가
          const rowData = row.getData();
          if (rowData && rowData.id) {
            selectedRows.current.add(rowData.id.toString());
          }
          
          console.log('행 선택 이벤트 - 모든 셀 선택 초기화');
          // 행 선택 시 모든 셀 선택 강제 초기화
          clearCellSelection();
          forceResetAllCellSelection();
          
          // 데이터 상태 업데이트
          updateDataStats();
          
          // 외부 콜백 호출
          if (onRowSelected) {
            onRowSelected(row);
          }
        },
        
        rowDeselected: function(row: any) {
          // 행이 선택 해제될 때마다 ID를 selectedRows에서 제거
          const rowData = row.getData();
          if (rowData && rowData.id) {
            selectedRows.current.delete(rowData.id.toString());
          }
          
          // 행 선택 해제 시에도 모든 셀 선택 강제 초기화
          clearCellSelection();
          forceResetAllCellSelection();
          
          // 데이터 상태 업데이트
          updateDataStats();
          
          // 외부 콜백 호출
          if (onRowDeselected) {
            onRowDeselected(row);
          }
        },
        
        // 데이터 변경 이벤트 (필터링, 정렬 등)
        dataFiltered: function() {
          updateDataStats();
        },
        dataLoaded: function() {
          updateDataStats();
        },
        dataSorted: function() {
          updateDataStats();
        },
        ...additionalOptions
      };

      // Tabulator 인스턴스 생성
      tabulatorRef.current = new Tabulator(tableRef.current, options);

      // 다크모드 CSS 스타일 추가
      if (isDark) {
        const styleId = 'tabulator-dark-styles';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;
        
        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.id = styleId;
          document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = `
          .tabulator-dark .tabulator {
            background-color: #1f2937 !important;
            color: #f9fafb !important;
          }
          .tabulator-dark .tabulator-tableholder {
            background-color: #1f2937 !important;
          }
          .tabulator-dark .tabulator-header {
            background-color: #374151 !important;
            color: #f9fafb !important;
          }
          .tabulator-dark .tabulator-header .tabulator-col {
            background-color: #374151 !important;
            color: #f9fafb !important;
            border-color: #4b5563 !important;
          }
          .tabulator-dark .tabulator-row {
            background-color: #1f2937 !important;
            color: #f9fafb !important;
          }
          .tabulator-dark .tabulator-row:nth-child(even) {
            background-color: #111827 !important;
          }
          .tabulator-dark .tabulator-cell {
            background-color: inherit !important;
            color: #f9fafb !important;
            border-color: #374151 !important;
          }
          .tabulator-dark .tabulator-footer {
            background-color: #374151 !important;
            color: #f9fafb !important;
          }
        `;
      }

      // 전역 상태 초기화
      (window as any)._isCheckboxProcessing = false;

      // 테이블 렌더링이 완료되면 이벤트 핸들러 추가
      tabulatorRef.current.on("tableBuilt", () => {
        // spreadsheet 모드가 아닐 때만 커스텀 핸들러 설정
        if ((additionalOptions as any)?.spreadsheet !== true) {
          setupCustomHandlers();
        }
        
        // 다크모드 스타일 재적용
        if (isDark) {
          setTimeout(() => {
            const tableElement = tableRef.current?.querySelector('.tabulator');
            if (tableElement) {
              // !important로 강제 적용
              tableElement.style.setProperty('background-color', '#1f2937', 'important');
              tableElement.style.setProperty('color', '#f9fafb', 'important');
              
              // 헤더 스타일
              const headers = tableElement.querySelectorAll('.tabulator-header');
              headers.forEach((header: any) => {
                header.style.setProperty('background-color', '#374151', 'important');
                header.style.setProperty('color', '#f9fafb', 'important');
              });
              
              // 행 스타일
              const rows = tableElement.querySelectorAll('.tabulator-row');
              rows.forEach((row: any) => {
                row.style.setProperty('background-color', '#1f2937', 'important');
                row.style.setProperty('color', '#f9fafb', 'important');
              });
              
              // 셀 스타일
              const cells = tableElement.querySelectorAll('.tabulator-cell');
              cells.forEach((cell: any) => {
                cell.style.setProperty('background-color', '#1f2937', 'important');
                cell.style.setProperty('color', '#f9fafb', 'important');
                cell.style.setProperty('border-color', '#374151', 'important');
              });
              
              // 테이블 래퍼 스타일
              const tableWrapper = tableElement.querySelector('.tabulator-tableholder');
              if (tableWrapper) {
                tableWrapper.style.setProperty('background-color', '#1f2937', 'important');
              }
            }
          }, 100);
        }
        
          // 초기 데이터 상태 정보 설정
          updateDataStats();
          
          // 이벤트 리스너로 추가
          tabulatorRef.current?.on("pageLoaded", updateDataStats);
          tabulatorRef.current?.on("dataFiltered", updateDataStats);
          tabulatorRef.current?.on("dataSorted", updateDataStats);
          tabulatorRef.current?.on("dataChanged", updateDataStats);
          tabulatorRef.current?.on("rowSelected", updateDataStats);
          tabulatorRef.current?.on("rowDeselected", updateDataStats);
          
          // cellClick 이벤트 등록
          if (onCellClick) {
            tabulatorRef.current?.on("cellClick", onCellClick);
          }
          
          // 모든 placeholder 요소에 흰색 배경 강제 적용
          function forceWhitePlaceholder() {
            // 모든 placeholder 요소 찾기
            const allPlaceholderElements = document.querySelectorAll(
              '.tabulator-placeholder, ' +
              '.tabulator-tableholder, ' +
              '.tabulator-placeholder-contents, ' + 
              '.tabulator-placeholder span, ' +
              '.tabulator-tableholder:empty, ' +
              '.tabulator-calcs-holder, ' +
              '.tabulator-tableholder .tabulator-placeholder'
            );
            
            allPlaceholderElements.forEach(el => {
              const element = el as HTMLElement;
              element.style.setProperty('background', 'white', 'important');
              element.style.setProperty('background-color', 'white', 'important');
            });
            
            // 페이지네이션 영역도 흰색으로
            const paginationElements = document.querySelectorAll(
              '.tabulator-footer, ' +
              '.tabulator-footer-contents, ' +
              '.tabulator-paginator, ' +
              '.tabulator-page'
            );
            
            paginationElements.forEach(el => {
              const element = el as HTMLElement;
              element.style.setProperty('background', 'white', 'important');
              element.style.setProperty('background-color', 'white', 'important');
            });
          }
          
          // 즉시 실행
          forceWhitePlaceholder();
          
          // 이벤트 발생 시에도 실행 
          tabulatorRef.current?.on("pageLoaded", forceWhitePlaceholder);
          tabulatorRef.current?.on("dataLoaded", forceWhitePlaceholder);
          tabulatorRef.current?.on("dataChanged", forceWhitePlaceholder);
          
          // 일정 시간 후에도 실행
          setTimeout(forceWhitePlaceholder, 200);
          setTimeout(forceWhitePlaceholder, 500);
          setTimeout(forceWhitePlaceholder, 1000);
          
          // 빈 공간만 흰색으로 설정
          const setEmptySpaceWhite = () => {
            // 빈 공간만 타겟팅
            const emptySpaces = document.querySelectorAll('.tabulator-placeholder, .tabulator-tableHolder');
            emptySpaces.forEach(el => {
              (el as HTMLElement).style.background = 'white';
            });
            
            // 테이블 아래쪽 푸터 영역 (페이징 컨트롤)
            const footerElement = document.querySelector('.tabulator-footer');
            if (footerElement) {
              (footerElement as HTMLElement).style.background = 'white';
            }
          };
          
          // 페이지 로드/변경 이벤트에 설정 함수 등록
          setEmptySpaceWhite();
          tabulatorRef.current?.on("pageLoaded", setEmptySpaceWhite);
          tabulatorRef.current?.on("dataChanged", setEmptySpaceWhite);
          tabulatorRef.current?.on("dataLoaded", setEmptySpaceWhite);
          tabulatorRef.current?.on("scrollVertical", setEmptySpaceWhite);
          
          // 마지막 행 테두리 추가
          const addLastRowBorder = () => {
            const tableElement = document.querySelector('.tabulator') as HTMLElement;
            if (tableElement) {
              tableElement.style.borderBottom = '1px solid #e2e8f0';
            }
            
            const lastRow = document.querySelector('.tabulator-row:last-child');
            if (lastRow) {
              const cells = lastRow.querySelectorAll('.tabulator-cell');
              cells.forEach(cell => {
                (cell as HTMLElement).style.borderBottom = '1px solid #e2e8f0';
              });
            }
          };
          
          // 처음 한 번 실행
          addLastRowBorder();
          
          // 테이블 데이터 변경 시 다시 실행
          tabulatorRef.current?.on("dataChanged", addLastRowBorder);
          tabulatorRef.current?.on("dataLoaded", addLastRowBorder);
          tabulatorRef.current?.on("pageLoaded", addLastRowBorder);
          
          // 체크박스 이벤트 핸들러 설정
          setupCheckboxHandlers();
          
          // 안전장치로 약간의 지연 후 체크박스 핸들러 재설정
          setTimeout(setupCheckboxHandlers, 300);
          
          // 이벤트 등록
          if (tabulatorRef.current) {
            // TypeScript 오류 회피를 위해 any 타입으로 캐스팅
            const tabulator = tabulatorRef.current as any;
            tabulator.on("dataLoaded", setupCheckboxHandlers);
            tabulator.on("dataFiltered", setupCheckboxHandlers);
            tabulator.on("dataSorted", setupCheckboxHandlers);
            tabulator.on("pageLoaded", setupCheckboxHandlers);
            tabulator.on("rowMoved", setupCheckboxHandlers);
          }
      });

      // 스타일 추가
      const styleId = 'tabulator-grid-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          .selected-cell {
            background-color: rgba(33, 150, 243, 0.2) !important;
            box-shadow: inset 0 0 0 1px rgba(33, 150, 243, 0.5);
          }
          
          /* 텍스트 선택 비활성화 */
          .tabulator {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            border: 1px solid #e2e8f0 !important;
          }
          
          /* 테이블 상단 테두리 강화 */
          .tabulator-header {
            border-bottom: 1px solid #e2e8f0 !important;
          }
          
          /* 줄무늬 배경 패턴 */
          .striped-background {
            background: repeating-linear-gradient(
              to bottom,
              white 0px,
              white 35px,
              #f9fafb 35px,
              #f9fafb 70px
            ) !important;
          }
          
          /* 빈 공간 배경 스타일 */
          .tabulator-tableHolder {
            background: repeating-linear-gradient(
              to bottom,
              white 0px,
              white 35px,
              #f9fafb 35px,
              #f9fafb 70px
            ) !important;
          }
          
          .tabulator-placeholder {
            background: repeating-linear-gradient(
              to bottom,
              white 0px,
              white 35px,
              #f9fafb 35px,
              #f9fafb 70px
            ) !important;
          }
          
          /* 테이블 테두리 */
          .tabulator-cell {
            border-right: 1px solid #dee2e6;
            border-bottom: 1px solid #dee2e6;
          }
          
          /* 홀수/짝수 행 스타일링 */
          .tabulator-row {
            background-color: white !important;
            cursor: pointer; /* 행에 마우스 포인터 커서 표시 */
          }
          
          .tabulator-row.tabulator-row-even {
            background-color: #f9fafb !important;
          }
          
          /* 체크박스 셀 스타일 */
          .tabulator-cell[tabulator-field="selected"] {
            background-color: rgba(0, 0, 0, 0.03) !important;
            border-right: 1px solid #dee2e6 !important;
            position: relative !important;
            cursor: pointer !important;
            z-index: 1;
            text-align: center !important;
          }
          
          /* 체크박스 요소 스타일 */
          .tabulator-cell[tabulator-field="selected"] .tabulator-checkbox {
            position: relative;
            z-index: 2;
            cursor: pointer !important;
            margin: 0 auto !important;
          }
          
          /* 선택된 행 스타일 */
          .tabulator-row.tabulator-selected {
            background-color: rgba(33, 150, 243, 0.2) !important;
          }
          
          .tabulator-row.tabulator-selected .tabulator-cell {
            border-color: #c0d8ea !important;
          }
          
          /* 푸터 데이터 상태 표시 스타일 */
          .tabulator-footer-data-stats {
            display: inline-block;
            float: left;
            margin-right: 10px;
            padding: 5px 10px;
            border-right: 1px solid #eee;
          }
        `;
        document.head.appendChild(style);
      }
      
      // 클린업 함수 설정
      return () => {
        // spreadsheet 모드가 활성화되어 있으면 커스텀 핸들러를 제거하지 않음
        if ((additionalOptions as any)?.spreadsheet === true) {
          // spreadsheet 모드는 Tabulator가 직접 관리
        } else {
          // 이벤트 리스너 제거
          if (tableRef.current && enableCellSelection) {
            const tableElement = tableRef.current;
            tableElement.removeEventListener('click', handleCellClick);
            tableElement.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('keydown', handleKeyDown);
          }
        }
        
        // Tabulator 글로벌 클릭 이벤트 제거
        if ((window as any)._handleGlobalClick) {
          document.removeEventListener('click', (window as any)._handleGlobalClick, true);
          delete (window as any)._handleGlobalClick;
        }
        
        // 체크박스 셀 이벤트 제거
        const checkboxCells = document.querySelectorAll('.tabulator-cell[tabulator-field="selected"]');
        checkboxCells.forEach(cell => {
          cell.removeEventListener('click', checkboxClickHandler as any);
          if ((window as any)._checkboxHandlerFunction) {
            cell.removeEventListener('click', (window as any)._checkboxHandlerFunction);
          }
        });
        
        // 전역 상태 정리
        if ((window as any)._isCheckboxProcessing !== undefined) {
          delete (window as any)._isCheckboxProcessing;
        }
        
        if ((window as any)._checkboxHandlerFunction !== undefined) {
          delete (window as any)._checkboxHandlerFunction;
        }
        
        // Tabulator 인스턴스 완전히 제거
        if (tabulatorRef.current) {
          try {
            // Tabulator 인스턴스를 destroy하면 모든 이벤트 리스너가 자동으로 제거됩니다
            if (typeof (tabulatorRef.current as any).destroy === 'function') {
              (tabulatorRef.current as any).destroy();
            }
            tabulatorRef.current = null;
          } catch (error) {
            console.warn("테이블 destroy 중 오류 발생:", error);
          }
        }
        
        // 알림 포커스 클릭 이벤트 제거
        if ((window as any)._handleNoticeClick) {
          document.removeEventListener('click', (window as any)._handleNoticeClick);
          delete (window as any)._handleNoticeClick;
        }
        
        // 필터 토글 버튼 이벤트 제거
        if ((window as any)._filterToggleButtons) {
          delete (window as any)._filterToggleButtons;
        }
        
        // 스타일 제거
        const styleElement = document.getElementById('tabulator-grid-styles');
        if (styleElement && styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
        
        // 다크모드 스타일 제거
        const darkStyleElement = document.getElementById('tabulator-dark-styles');
        if (darkStyleElement && darkStyleElement.parentNode) {
          darkStyleElement.parentNode.removeChild(darkStyleElement);
        }
      };
    }
  }, [data, columns, theme]); // 데이터, 컬럼, 테마가 변경될 때 다시 렌더링

  return (
    <div
      className={`tabulator-grid-wrapper ${className}`}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}
    >
      <div 
        className={`border rounded overflow-hidden ${theme === 'dark' ? 'tabulator-dark' : 'tabulator-light'}`}
        style={{ 
          borderColor: theme === 'dark' ? '#374151' : '#e2e8f0',
          backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
          flex: 1,
          minHeight: 0
        }}
      >
        <div ref={tableRef} className={`w-full h-full ${theme === 'dark' ? 'tabulator-dark' : 'tabulator-light'}`}></div>
      </div>
      
      {/* 커스텀 푸터 */}
      {showFooter && (
        <div 
          className={`flex items-center justify-between px-3 py-1 text-[10px] border-t flex-shrink-0 ${theme === 'dark' ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
        >
        <div className="flex items-center gap-2 flex-wrap">
          <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
            총 <span className="font-bold text-[10px]" style={{ color: theme === 'dark' ? '#60a5fa' : '#2563eb' }}>{dataStats.total}</span>개 중 
            <span className="font-bold text-[10px]" style={{ color: theme === 'dark' ? '#fbbf24' : '#d97706' }}>{dataStats.filtered}</span>개 표시 
            {Object.keys(dataStats.categoryCounts).length > 0 && (
              <span className="ml-3 inline-flex items-center gap-2 flex-wrap">
                {Object.entries(dataStats.categoryCounts).map(([category, count]) => {
                  const isActive = activeCategoryFilter === category;
                  return (
                    <span 
                      key={category}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border cursor-pointer transition-all hover:opacity-80"
                      style={{
                        backgroundColor: isActive 
                          ? (theme === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.25)')
                          : (theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'),
                        borderColor: isActive
                          ? (theme === 'dark' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.6)')
                          : (theme === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.4)'),
                        borderWidth: isActive ? '2px' : '1px',
                        color: theme === 'dark' ? '#93c5fd' : '#1e40af',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)'
                      }}
                      onClick={() => {
                        if (tabulatorRef.current) {
                          if (isActive) {
                            // 이미 선택된 경우 필터 해제
                            tabulatorRef.current.setHeaderFilterValue('category_l1', '');
                            setActiveCategoryFilter(null);
                          } else {
                            // 다른 대분류가 선택되어 있으면 해제하고 새로 선택
                            if (activeCategoryFilter) {
                              tabulatorRef.current.setHeaderFilterValue('category_l1', '');
                            }
                            // 해당 대분류로 필터링
                            tabulatorRef.current.setHeaderFilterValue('category_l1', category);
                            setActiveCategoryFilter(category);
                          }
                          // 필터링 후 통계 업데이트 (이벤트가 발생하기 전에 약간의 지연)
                          setTimeout(() => {
                            updateDataStats();
                          }, 150);
                        }
                      }}
                      title={isActive ? '클릭하여 필터 해제' : '클릭하여 필터링'}
                    >
                      <span className="font-bold text-[10px]">{category}</span>
                      <span className="font-semibold text-[10px]">: {count}개</span>
                    </span>
                  );
                })}
              </span>
            )}
            {selectedCount > 0 && (
              <span className="ml-3">
                <span className="font-bold px-1.5 py-0.5 rounded text-[10px]" style={{
                  backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.15)',
                  color: theme === 'dark' ? '#86efac' : '#15803d',
                  border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.5)' : 'rgba(34, 197, 94, 0.3)'}`
                }}>
                  {selectedCount}개 선택
                </span>
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Page Size</span>
          <select 
            className={`px-2 py-1 rounded border ${theme === 'dark' ? 'bg-gray-600 text-gray-200 border-gray-500' : 'bg-white text-gray-700 border-gray-300'}`}
            value={pageSize === "all" ? "all" : pageSize}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setPageSize("all");
                setCurrentPage(1);
              } else {
                setPageSize(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            {paginationSizeSelector.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
            <option value="all">ALL</option>
          </select>
          <div className="flex items-center gap-1">
            {(() => {
              const isAll = pageSize === "all";
              const size = isAll ? dataStats.total : (pageSize as number);
              const totalPages = isAll ? 1 : Math.ceil(dataStats.total / size);
              return (
                <>
                  <button 
                    className={`px-2 py-1 rounded border ${isAll || currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'dark' ? 'bg-gray-600 text-gray-200 border-gray-500 hover:bg-gray-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => !isAll && setCurrentPage(1)}
                    disabled={isAll || currentPage === 1}
                  >
                    First
                  </button>
                  <button 
                    className={`px-2 py-1 rounded border ${isAll || currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'dark' ? 'bg-gray-600 text-gray-200 border-gray-500 hover:bg-gray-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => !isAll && setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={isAll || currentPage === 1}
                  >
                    Prev
                  </button>
                  <button 
                    className={`px-2 py-1 rounded border ${theme === 'dark' ? 'bg-gray-500 text-gray-100 border-gray-400' : 'bg-blue-500 text-white border-blue-500'}`}
                  >
                    {currentPage}
                  </button>
                  <button 
                    className={`px-2 py-1 rounded border ${isAll || currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'dark' ? 'bg-gray-600 text-gray-200 border-gray-500 hover:bg-gray-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => !isAll && setCurrentPage(currentPage + 1)}
                    disabled={isAll || currentPage >= totalPages}
                  >
                    Next
                  </button>
                  <button 
                    className={`px-2 py-1 rounded border ${isAll || currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'dark' ? 'bg-gray-600 text-gray-200 border-gray-500 hover:bg-gray-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => !isAll && setCurrentPage(totalPages)}
                    disabled={isAll || currentPage >= totalPages}
                  >
                    Last
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      </div>
      )}
      
      {/* 복사를 위한 숨겨진 텍스트 영역 */}
      <textarea
        ref={textareaRef}
        style={{ position: 'absolute', left: '-9999px', top: 0 }}
        aria-hidden="true"
      />
    </div>
  );
});

TabulatorGrid.displayName = 'TabulatorGrid';

export default TabulatorGrid; 