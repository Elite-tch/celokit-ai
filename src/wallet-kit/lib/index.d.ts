// Re-export all wallet components
export { default as ConnectButton } from '../wallet/WalletConnection';
export { default as NetworkSwitcher } from '../wallet/NetworkSwitcher';
export { default as SendTransaction } from '../wallet/SendTransaction';
export { Providers } from '../wallet/Providers';
export { default as Modal } from '../wallet/Modal';
export const styles = '../wallet/celokit-ui.css';

// Explicitly declare the config export
import { Config } from 'wagmi';
export declare const config: Config;

// Type for the Providers component
import { ReactNode } from 'react';
export interface ProvidersProps {
  children: ReactNode;
}
export declare function Providers(props: ProvidersProps): JSX.Element;