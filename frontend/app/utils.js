import { useRouter } from 'next/navigation';

export const withRouter = (Component) => ({ children, ...props }) => (
  <Component router={useRouter()} {...props}>
    {children}
  </Component>
)
