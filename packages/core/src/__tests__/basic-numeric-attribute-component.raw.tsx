type Props = {
  count?: number;
};

export default function MyNumericAttributeComponent(props: Props) {
  return <div>{props.count}</div>;
}
