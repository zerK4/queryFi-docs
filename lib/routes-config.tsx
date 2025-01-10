// for page navigation & to sort on leftbar

import {
  BarChartIcon,
  Barcode,
  BlocksIcon,
  BracketsIcon,
  ChevronsRightIcon,
  FilterIcon,
  HammerIcon,
  Layers3Icon,
  ReplaceAllIcon,
  RouteIcon,
  Scale3DIcon,
  SortAscIcon,
  TextSelectIcon,
} from "lucide-react";
import React from "react";

export type EachRoute = {
  icon?: React.ReactNode;
  title: string;
  href: string;
  noLink?: true; // noLink will create a route segment (section) but cannot be navigated
  items?: EachRoute[];
};

export const ROUTES: EachRoute[] = [
  {
    title: "Installation",
    href: "/installation",
    icon: <BlocksIcon size={16} />,
  },
  {
    icon: <Scale3DIcon size={16} />,
    title: "Transformers",
    href: "/transform",
  },
  {
    icon: <Barcode size={16} />,
    title: "Defaults",
    href: "/defaults",
  },
  {
    icon: <ReplaceAllIcon size={16} />,
    title: "Mutator",
    href: "/mutator",
  },
  {
    title: "",
    href: "",
  },
  {
    title: "",
    href: "",
  },
  {
    title: "Methods",
    href: "/methods",
    noLink: true,
    items: [
      {
        icon: <RouteIcon size={16} />,
        title: "Path",
        href: "/path",
      },
      {
        icon: <TextSelectIcon size={16} />,
        title: "Select",
        href: "/select",
      },
      {
        icon: <FilterIcon size={16} />,
        title: "Where",
        href: "/where",
      },
      {
        icon: <Layers3Icon size={16} />,
        title: "With",
        href: "/with",
      },
      {
        icon: <SortAscIcon size={16} />,
        title: "Order by",
        href: "/orderBy",
      },
      {
        icon: <BarChartIcon size={16} />,
        title: "Limit",
        href: "/limit",
      },
      {
        icon: <ChevronsRightIcon size={16} />,
        title: "Paginate/Page",
        href: "/paginate",
      },
      {
        icon: <BracketsIcon size={16} />,
        title: "Getters",
        href: "/getters",
      },
      {
        icon: <HammerIcon size={16} />,
        title: "Build",
        href: "/build",
      },
    ],
  },
  {
    title: "",
    href: "",
  },
  {
    title: "Contribute",
    href: "/contribute",
  },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
