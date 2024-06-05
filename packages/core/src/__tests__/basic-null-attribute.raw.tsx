import MyNullAttributeComponent from './basic-null-attribute-component.raw';

type Props = {
  children: any;
  type: string;
};

export default function MyNullAttribute(props: Props) {
  return (
    <div>
      <Show when={props.children}>
        {props.children} {props.type}
      </Show>
      <MyNullAttributeComponent value={undefined} />
      <MyNullAttributeComponent value={null} />
    </div>
  );
}
