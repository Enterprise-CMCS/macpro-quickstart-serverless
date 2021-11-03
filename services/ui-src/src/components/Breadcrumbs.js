import { Breadcrumb } from "react-bootstrap";
import { Link, useRouteMatch, useParams } from "react-router-dom";
import { routes } from "../Routes";
import "./Breadcrumb.css";

export const Breadcrumbs = () => {
  const routeMatch = useRouteMatch();
  const params = useParams();
  const items = routes
    .filter(({ path }) => routeMatch.path.includes(path))
    .map(({ path, ...rest }) => ({
      path: Object.keys(params).length
        ? Object.keys(params).reduce(
            (path, param) => path.replace(`:${param}`, params[param]),
            path
          )
        : path,
      ...rest,
    }));

  return (
    <Breadcrumb>
      {items.map((item, idx) => (
        <Breadcrumb.Item
          key={"breadcrumbs_" + item.path}
          linkProps={{ to: item.path }}
          linkAs={Link}
          active={idx + 1 === items.length}
        >
          {item.name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};
