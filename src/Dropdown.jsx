import {
  useState,
  useEffect,
  useMemo,
  useRef,
  Fragment,
} from 'react'
import {
  Dropdown,
  Menu,
  Button,
} from 'antd';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';


function CustomDropdown() {

  useEffect(() => {
    ReactDOM.render(<Dropdown
      getPopupContainer={() => document.querySelector('#root')}
      trigger={['click']}
      transitionName="none"
      overlay={Items()}>
      <Button>点击</Button>
    </Dropdown>, document.querySelector('.App'));
  }, []);
  return <div className="App">
    {/* <Dropdown
      getPopupContainer={() => document.querySelector('.App')}
      trigger={['click']}
      transitionName="none"
      overlay={Items()}>
      <Button>点击</Button>
    </Dropdown> */}
  </div>;
}

function Items() {
  return <div style={{ border: '1px solid red' }}>
    <Menu.Item>第一个</Menu.Item>
    <Menu.Item>第二个</Menu.Item>
    <Menu.Item>第三个</Menu.Item>
    <Menu.Item>第四个</Menu.Item>
  </div>;
}

export default CustomDropdown;