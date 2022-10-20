import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import {
  Dropdown,
} from 'antd';
import ReactDOM from 'react-dom';
import { S2Event } from '@antv/s2';

import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import './App.css'
import insertCss from 'insert-css';

function Pivot() {
  const [dataCfg, setS2DataConfig] = useState([])
  const s2Options = {
    width: 600,
    height: 480,
  };

  useEffect(() => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
    )
      .then((res) => res.json())
      .then((res) => {
        // setS2DataConfig(res);
        handleData(res);
        console.log(res)
        ReactDOM.render(<SheetComponent
          dataCfg={res}
          options={s2Options} />, document.querySelector('.App'));
      })

  });
  return (
    <div
      className="App">
       {/* <SheetComponent
        dataCfg={dataCfg}
        // onColCellHover={onColCellHover}
        options={s2Options} /> */}
    </div>
  );

  function handleData(res) {
    // delete res.fields.columns;
    res.data = res.data.map(ele => {
      delete ele.province;
      return ele;
    });
    res.fields.rows = res.fields.rows.filter(ele => ele !== "province");
    res.meta = res.meta.filter(ele => ele.field !== 'province');
    res.totalData = res.totalData.map(ele => {
      delete ele.province;
      return ele;
    });

  }

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
    return <div>{title}</div>;
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

export default Pivot
