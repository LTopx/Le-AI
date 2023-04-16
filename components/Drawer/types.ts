export interface IDrawerPropTypes extends React.PropsWithChildren {
  className?: string;
  onClose?: () => void;
  open?: boolean;
  width?: number | string;
}
