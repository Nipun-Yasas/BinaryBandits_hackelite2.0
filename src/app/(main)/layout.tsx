"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";

import Box from "@mui/material/Box";
import CustomToolbarActions from "../_components/main/CustomToolbarActions";
import CustomAppTitle from "../_components/main/CustomAppTitle";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {

  return (
    <DashboardLayout
      slots={{
        appTitle: CustomAppTitle,
        toolbarActions: CustomToolbarActions,
      }}
    >
      <PageContainer>
       
          {children}
      </PageContainer>
    </DashboardLayout>
  );
}
