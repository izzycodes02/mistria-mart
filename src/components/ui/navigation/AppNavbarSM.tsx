import { ROUTES } from "@/routes";
import {
  IconSettings,
  IconLogout,
  IconHome,
  IconBooks,
  IconLayoutGrid,
  IconChartDots2,
} from "@tabler/icons-react";


export default function AppNavbarSM() {

  return (
    <div className="phoneNav">
      <a href={ROUTES.HOME} className="home">
        <IconHome />
      </a>
      <a href={ROUTES.LIBRARY}>
        <IconBooks />
      </a>
      <a href={ROUTES.COLLECTIONS}>
        <IconLayoutGrid />
      </a>
      <a href="">
        <IconChartDots2 />
      </a>
      <a href={ROUTES.ACCOUNT_SETTINGS}>
        <IconSettings />
      </a>
    </div>
  );
}
