import { IExtensionMetadata, IExtensionBasicMetadata } from '@alipay/alex-shared';
import { useState, useEffect } from 'react';

// 本地插件模拟 将代理 getLocalExtensionsMetadata 接口返回处理过的数据
export const useLoadLocalExtensionMetadata = () => {
  const [extensions, setExtensions] = useState<IExtensionBasicMetadata[] | null>(null);
  useEffect(() => {
    (async () => {
      const res = await fetch('/getLocalExtensionsMetadata');
      const localExtensions: IExtensionBasicMetadata[] = await res.json();
      setExtensions(localExtensions);
    })();
  }, []);
  return extensions;
};