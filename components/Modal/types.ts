export interface IModalPropTypes extends React.PropsWithChildren {
  title?: React.ReactNode;
  open: boolean;
  width?: number;
  onClose: () => void;
}
