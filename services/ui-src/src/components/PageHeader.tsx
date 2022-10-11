import "./PageHeader.css";

export const PageHeader = ({ children }: any) => {
  return (
    <div className="page-header" data-testid="page-header">
      <h1>{children}</h1>
    </div>
  );
};
