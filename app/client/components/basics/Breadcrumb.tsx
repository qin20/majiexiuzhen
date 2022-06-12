import React from 'react';
import {
  Link,
} from '@remix-run/react';

type Props = {
  className?: string;
}

const Breadcrumb: React.FC<Props> = ({ children, className = '' }) => {
  return <ol className={`flex items-center whitespace-pre ${className}`}>{children}</ol>;
};

export const BreadcrumbItem: React.FC = ({ children }) => {
  return <li className="flex items-center">{ children }</li>;
};

export const BreadcrumbItemMainPage: React.FC = ({ children }) => {
  return (
    <BreadcrumbItem>
      <svg className="h-4 mr-px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: -4 }}>
        <path fill="currentColor" d="M919.2 419.2L531.2 141.6c-11.2-8-26.4-8-36.8 0L104 419.2c-12.8 8.8-6.4 28.8 9.6 28.8H192v432c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16V640h192v240c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16V448h78.4c15.2 0 21.6-20 8.8-28.8z"></path>
      </svg>
      <Link to="/">首页</Link>
    </BreadcrumbItem>
  );
};

export default Breadcrumb;
