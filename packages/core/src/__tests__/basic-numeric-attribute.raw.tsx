import MyNumericAttributeComponent from './basic-numeric-attribute-component.raw';

type Props = {
  children: any;
  type: string;
};

export default function MyNumericAttribute(props: Props) {
  return (
    <div>
      <Show when={props.children}>
        {props.children} {props.type}
      </Show>
      <MyNumericAttributeComponent count={0} />
      <MyNumericAttributeComponent count={1} />
      <MyNumericAttributeComponent count={100} />
    </div>
  );
}
