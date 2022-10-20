import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import ReactDOM from 'react-dom';
import lodashGet from 'lodash.get';
import lodashSet from 'lodash.set';
import {
  S2Event,
  DataCell,
} from '@antv/s2';

import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import './App.css'
import insertCss from 'insert-css';

const icon = import('./type-string.svg');

function App() {
  const [data, setData] = useState([])
  const s2Ref = useRef(null)

  const getSpreadSheet = (instance) => {
    s2Ref.current = instance
    console.log('wukai----', instance);
    // instance.on(S2Event.DATA_CELL_BRUSH_SELECTION, (...args) => {
    //   console.log('wukai----11', args);
    // });
    // instance.on(S2Event.GLOBAL_SELECTED, (...args) => {
    //   console.log('wukai----22', args);
    // });
  }

  useEffect(() => {
    fetch(
      // 'https://s2.antv.vision/zh/examples/data/basic-table-mode.json',
      'https://s2.antv.vision/zh/examples/data/basic-table-mode.json',
    )
      .then((res) => res.json())
      .then((res) => {

        setData(res);
        const s2Options = {
          width: window.innerWidth,
          height: window.innerWidth,
          showSeriesNumber: true,
          tooltip: {
            showTooltip: true,
          },
          interaction: {
            enableCopy: true,
            resize: true,
            // 禁用默认的悬停聚焦效果, 防止出现默认的 tooltip (hover 在数值单元格 800ms 后, 会显示 tooltip)
            rangeSelection: true,
            multiSelection: true,
            brushSelection: true,
          },
          style: {
            colCfg: {
              height: 0,
              // widthByFieldValue,
            },
            layoutWidthType: "adaptive",
          },
          // customSVGIcons: [{
          //   name: 'string',
          //   // eslint-disable-next-line
          //   svg: icon,
          // }],
          showDefaultHeaderActionIcon: true,
          // headerActionIcons: [{
          //   iconNames: ['string'],
          //   belongsCell: 'colCell',
          //   displayCondition: meta => {
          //     return true;
          //   },
          //   action: () => { },
          // }],
          dataCell: (viewMeta) => {
            const {
              rowIndex,
              colIndex,
            } = viewMeta;
            // console.log('wukai----', viewMeta);
            lodashSet(viewMeta,
              'spreadsheet.theme.dataCell.cell.backgroundColor', '#fff')
            if (rowIndex === 4) {
              lodashSet(viewMeta, 'spreadsheet.theme.dataCell.cell.backgroundColor', '#ecf2fe')
            }
            return new DataCell(viewMeta, viewMeta?.spreadsheet);
          }
        };

        const col = {
          province: 'province',
          city: 'city',
          type: 'type',
          price: 'price',
          cost: 'cost',
        };

        const s2DataConfig = {
          fields: {
            columns: ['province', 'city', 'type', 'price', 'cost'],
          },
          meta: [
            {
              field: 'province',
              name: '省份',
            },
            {
              field: 'city',
              name: '城市',
            },
            {
              field: 'type',
              name: '商品类别',
            },
            {
              field: 'price',
              name: '价格',
            },
            {
              field: 'cost',
              name: '成本',
            },
          ],
          data: [col].concat(res),
        };

        ReactDOM.render(<SheetComponent
          getSpreadSheet={getSpreadSheet}
          dataCfg={s2DataConfig}
          // themeCfg={theme}
          onDataCellClick={onDataClick}
          // onColCellHover={onColCellHover}
          onRowCellClick={onRowCellClick}
          onRowCellHover={onRowCellHover}
          options={s2Options}
          sheetType="table" />, document.querySelector('.App'));
      });
  });

  function onRowCellHover(params) {
    console.log('wukai---- 222 行头 hover 事件', params);
  }

  function onRowCellClick(params) {
    console.log('wukai---222', '行头 click 事件', params);
  }

  function onDataClick() {
    console.log('wukai----1111 click 事件')
  }

  // useEffect(() => {
  //   if (s2Ref.current) {
  //     s2Ref.current.on(S2Event.DATA_CELL_BRUSH_SELECTION, (...args) => {
  //       console.log('wukai----', rags);
  //     });
  //     s2Ref.current.on(S2Event.GLOBAL_SELECTED, (...args) => {
  //       console.log('wukai----', rags);
  //     });
  //   }
  // // }, [s2Ref.current]);
  // return data.length
  //   ? <SheetComponent
  //     getSpreadSheet={getSpreadSheet}
  //     dataCfg={s2DataConfig}
  //     // themeCfg={theme}
  //     onDataCellClick={onDataClick}
  //     // onColCellHover={onColCellHover}
  //     onRowCellClick={onRowCellClick}
  //     onRowCellHover={onRowCellHover}
  //     options={s2Options}
  //     sheetType="table" />
  //   : null;

  return <div className="App">

  </div>

  function onColCellHover({ event, viewMeta }) {
    viewMeta?.spreadsheet?.tooltip?.show({
      position: {
        x: event.clientX,
        y: event.clientY,
      },
      content: <CustomTooltip title={viewMeta.label || viewMeta.field} />,
    });
  }

  function CustomTooltip(props) {
    const { title } = props;
    return <div>{title} {icon}</div>;
  }
}

export function pauseEvent(e, stop = false) {
  if (typeof e.persist === 'function') {
    e.persist();
  }
  if (typeof e.stopImmediatePropagation === 'function') {
    e.stopImmediatePropagation();
  }
  if (typeof e.stopPropagation === 'function') {
    e.stopPropagation();
  }
  if (stop && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
}

export default App
