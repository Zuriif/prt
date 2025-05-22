import { createCache } from '@ant-design/cssinjs';
import { StyleProvider } from 'antd-style';

export const AntdProvider = ({ children }) => {
  const cache = createCache();

  return (
    <StyleProvider cache={cache}>
      {children}
    </StyleProvider>
  );
}; 