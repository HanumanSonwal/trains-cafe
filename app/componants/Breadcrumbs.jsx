'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NextBreadcrumb = ({
  homeElement = "Home",
  separator = " > ",
  containerClasses = "breadcrumb-container",
  listClasses = "breadcrumb-item",
  activeClasses = "breadcrumb-active",
  capitalizeLinks = false,
}) => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter(path => path); // Filter empty path segments

  return (
    <div>
      <ul className={containerClasses}>
        <li className={listClasses}>
          <Link href={'/'}>{homeElement}</Link>
        </li>
        {
          pathNames.map((link, index) => {
            let href = `/${pathNames.slice(0, index + 1).join('/')}`;
            let isLast = index === pathNames.length - 1;
            let itemClasses = isLast ? `${listClasses} ${activeClasses}` : listClasses;
            let itemLink = capitalizeLinks ? link.charAt(0).toUpperCase() + link.slice(1) : link;

            return (
              <React.Fragment key={index}>
                <li className={itemClasses}>
                  <Link href={href}>{itemLink}</Link>
                </li>
                {!isLast && separator}
              </React.Fragment>
            );
          })
        }
      </ul>
    </div>
  );
};

export default NextBreadcrumb;
