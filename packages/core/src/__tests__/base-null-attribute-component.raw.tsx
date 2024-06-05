type Props = {
  value?: string | null;
};

export default function MyNullAttributeComponent(props: Props) {
  return <div>{props.value}</div>;
}
