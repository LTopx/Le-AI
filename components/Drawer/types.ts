export interface IDrawerPropTypes extends React.PropsWithChildren {
  className?: string;
  keyboard?: boolean;
  maskClosable?: boolean;
  onClose?: () => void;
  open?: boolean;
  title?: React.ReactNode;
  width?: number | string;
}
