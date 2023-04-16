export interface IDrawerPropTypes extends React.PropsWithChildren {
  className?: string;
  title?: React.ReactNode;
  onClose?: () => void;
  open?: boolean;
  width?: number | string;
}
