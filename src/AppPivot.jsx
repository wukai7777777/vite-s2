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
  RowCell,
} from '@antv/s2';

import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import './App.css'
import insertCss from 'insert-css';

const icon = import('./type-string.svg');

class CustomRowCell extends RowCell {
  // 覆盖背景绘制，可覆盖或者增加绘制方法
  drawBackgroundShape() {
    this.backgroundShape = this.addShape('image', {
      attrs: {
        ...this.getCellArea(),
        img: 'https://gw.alipayobjects.com/zos/antfincdn/og1XQOMyyj/1e3a8de1-3b42-405d-9f82-f92cb1c10413.png',
      },
    });
  }
}

function App() {
  const [data, setData] = useState([])
  const s2Ref = useRef(null)

  const getSpreadSheet = (instance) => {
    s2Ref.current = instance
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

        const s2Options = {
          width: window.innerWidth,
          height: window.innerWidth,
          showDefaultHeaderActionIcon: false,
          tooltip: {
            showTooltip: true,
          },
          interaction: {
            enableCopy: true,
            resize: true,
            hoverHighlight: false,
            linkFields: ['city'],
            // 禁用默认的悬停聚焦效果, 防止出现默认的 tooltip (hover 在数值单元格 800ms 后, 会显示 tooltip)
            // hoverFocus: false,
            // rangeSelection: false,
            // multiSelection: false,
            // brushSelection: {
            //   data: true,
            //   col: false,
            //   row: false,
            // },
          },
          style: {
            colCfg: {
              height: 30,
              // widthByFieldValue,
              hideMeasureColumn: true,
            },
            layoutWidthType: "adaptive",
          },
          supportCSSTransform: true,
          // customSVGIcons: [{
          //   name: 'string',
          //   // eslint-disable-next-line
          //   svg: icon,
          // }],
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
            // console.log('wukai---- dataCell', viewMeta);
            lodashSet(viewMeta,
              'spreadsheet.theme.dataCell.cell.backgroundColor', '#fff')
            if (rowIndex === 10) {
              lodashSet(viewMeta, 'spreadsheet.theme.dataCell.cell.backgroundColor', '#ecf2fe')
              if (colIndex === 0) {
                lodashSet(viewMeta, 'spreadsheet.theme.dataCell.cell.backgroundColor', '#0154f9')
                viewMeta.fieldValue = '设置表头';
              }
            }
            return new DataCell(viewMeta, viewMeta?.spreadsheet);
          },
          // rowCell: (node, s2, headConfig) => {
          //   console.log('wukai----', node,s2, headConfig);
          //   return new CustomRowCell(node, s2, headConfig);
          // },
          // colCell: (node, s2, headConfig) => {
          //   console.log('wukai----', node,s2, headConfig);
          //   return new CustomRowCell(node, s2, headConfig);
          // },
        };
        // s2Options.rowCell = (node, s2, rowConfig) => {
        //   const {
        //     colIndex,
        //     rowIndex,
        //   } = node;
        //   // console.log('wukai---', node, s2, rowConfig);
        //   lodashSet(rowConfig,
        //     'spreadsheet.theme.rowCell.cell.backgroundColor', '#fff');
        //   if (rowIndex === 7) {
        //     lodashSet(rowConfig,
        //       'spreadsheet.theme.rowCell.cell.backgroundColor', '#f00');
        //   }
        //   return new RowCell(node, s2, rowConfig);
        // }

        // const col = {
        //   province: 'province',
        //   city: 'city',
        //   type: 'type',
        //   price: 'price',
        //   cost: 'cost',
        // };

        // const s2DataConfig = {
        //   fields: {
        //     columns: ['province', 'city', 'type', 'price', 'cost'],
        //   },
        //   meta: [
        //     {
        //       field: 'province',
        //       name: '省份',
        //     },
        //     {
        //       field: 'city',
        //       name: '城市',
        //     },
        //     {
        //       field: 'type',
        //       name: '商品类别',
        //     },
        //     {
        //       field: 'price',
        //       name: '价格',
        //     },
        //     {
        //       field: 'cost',
        //       name: '成本',
        //     },
        //   ],
        //   data: [col].concat(res),
        // };

        const s2DataConfig = {
          "fields": {
            "rows": [
              "city"
            ],
            "columns": [
              "sub_type"
            ],
            "values": [
              "number"
            ],
          },
          "meta": [
            {
              "field": "number",
              "name": "数量",
            },
            {
              "field": "city",
              "name": "城市"
            },
            {
              "field": "sub_type",
              "name": "子类别"
            }
          ],
          "data": [
            {
              "number": 3877,
              "city": "宁波市",
              "sub_type": "桌子"
            },
            {
              "number": 4342,
              "city": "舟山市",
              "sub_type": "桌子"
            },
            {
              "number": 5343,
              "city": "杭州市",
              "sub_type": "沙发"
            },
            {
              "number": 632,
              "city": "绍兴市",
              "sub_type": "沙发"
            },
            {
              "number": 7234,
              "city": "宁波市",
              "sub_type": "沙发"
            },
            {
              "number": 834,
              "city": "舟山市",
              "sub_type": "沙发"
            },
            {
              "number": 945,
              "city": "杭州市",
              "sub_type": "笔"
            },
            {
              "number": 1304,
              "city": "绍兴市",
              "sub_type": "笔"
            },
            {
              "number": 1145,
              "city": "宁波市",
              "sub_type": "笔"
            },
            {
              "number": 1432,
              "city": "舟山市",
              "sub_type": "笔"
            },
            {
              "number": 1343,
              "city": "杭州市",
              "sub_type": "纸张"
            },
            {
              "number": 1354,
              "city": "绍兴市",
              "sub_type": "纸张"
            },
            {
              "number": 1523,
              "city": "宁波市",
              "sub_type": "纸张"
            },
            {
              "number": 1634,
              "city": "舟山市",
              "sub_type": "纸张"
            },
            {
              "number": 1723,
              "city": "成都市",
              "sub_type": "桌子"
            },
            {
              "number": 7789,
              "city": "杭州市",
              "sub_type": "桌子"
            },
            {
              "number": 2367,
              "city": "绍兴市",
              "sub_type": "桌子"
            },
            {
              "number": 1822,
              "city": "绵阳市",
              "sub_type": "桌子"
            },
            {
              "number": 1943,
              "city": "南充市",
              "sub_type": "桌子"
            },
            {
              "number": 2330,
              "city": "乐山市",
              "sub_type": "桌子"
            },
            {
              "number": 2451,
              "city": "成都市",
              "sub_type": "沙发"
            },
            {
              "number": 2244,
              "city": "绵阳市",
              "sub_type": "沙发"
            },
            {
              "number": 2333,
              "city": "南充市",
              "sub_type": "沙发"
            },
            {
              "number": 2445,
              "city": "乐山市",
              "sub_type": "沙发"
            },
            {
              "number": 2335,
              "city": "成都市",
              "sub_type": "笔"
            },
            {
              "number": 245,
              "city": "绵阳市",
              "sub_type": "笔"
            },
            {
              "number": 2457,
              "city": "南充市",
              "sub_type": "笔"
            },
            {
              "number": 2458,
              "city": "乐山市",
              "sub_type": "笔"
            },
            {
              "number": 4004,
              "city": "成都市",
              "sub_type": "纸张"
            },
            {
              "number": 3077,
              "city": "绵阳市",
              "sub_type": "纸张"
            },
            {
              "number": 3551,
              "city": "南充市",
              "sub_type": "纸张"
            },
            {
              "number": 352,
              "city": "乐山市",
              "sub_type": "纸张"
            }
          ]
        };

        const theme = {
          theme: {
            colCell: {
              cell: {
                backgroundColor: "rgb(237 238 240)",
                verticalBorderColor: "#fff",
                verticalBorderWidth: 2,
                horizontalBorderWidth: 0,
                horizontalBorderColor: "#fff",
                padding: {
                  left: 8,
                  top: 0,
                  bottom: 0,
                  right: 8,
                },
              },
              icon: {
                size: 14,
                margin: {
                  left: 5,
                },
                fill: '#ccc',
              },
              bolderText: {
                textAlign: "center",
                textBaseline: "middle",
                fontSize: 12,
                fontFamily: "Arial",
                fontWeight: "bold",
                fill: "#5B5E69",
              },
            },
            dataCell: {
              text: {
                textAlign: "center",
                textBaseline: "middle",
                fontSize: 12,
                fontFamily: "Arial",
                fontWeight: "normal",
                fill: "#5B5E69",
              },
              cell: {
                verticalBorderColor: "#d3d3d3",
                horizontalBorderColor: "#d3d3d3",
                backgroundColor: "yellow",
                crossBackgroundColor: 'red',
              },
            },
          },
        };

        ReactDOM.render(<SheetComponent
          getSpreadSheet={getSpreadSheet}
          dataCfg={s2DataConfig}
          themeCfg={theme}
          // onDataCellClick={onDataClick}
          onDataCellBrushSelection={onDataCellBrushSelection}
          // onColCellHover={onColCellHover}
          // onRowCellClick={onRowCellClick}
          // onDataCellHover={onDataCellHover}
          onColCellClick={onColCellClick}
          onRowCellClick={onColCellClick}
          options={s2Options}
          sheetType="pivot" />, document.querySelector('.App'));
      });
  });

  function onColCellClick(...params) {
    console.log('onColCellClick', params);
  }

  function onDataCellBrushSelection(...params) {
    console.log('wukai--- onDataCellBrushSelection', params);
  }

  function onDataCellHover({params}) {
    console.log('wukai---- 222 hover 事件', params);
  }

  function onRowCellClick(params) {
    console.log('wukai---222', '行头 click 事件', params);
  }

  function onDataClick(...args) {
    console.log('wukai----1111 click 事件', args);
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
  // }, [s2Ref.current]);
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
