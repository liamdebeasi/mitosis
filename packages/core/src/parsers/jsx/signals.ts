import { Node, Project, Symbol } from 'ts-morph';
import { getContextSymbols, getPropsSymbol } from '../../helpers/typescript-project';

export const findSignals = (args: {
  project: Project;
  signalSymbol: Symbol;
  code?: string;
  filePath?: string;
}) => {
  const { project, signalSymbol } = args;

  const ast = args.code
    ? args.project.createSourceFile('homepage2.lite.tsx', args.code)
    : args.filePath
    ? args.project.getSourceFileOrThrow(args.filePath)
    : undefined;

  if (ast === undefined) {
    throw new Error('Could not find AST. Please provide either `code` or `filePath` configs.');
  }

  const reactiveValues = {
    props: new Set<string>(),
    state: new Set<string>(),
    context: new Set<string>(),
  };

  const propsSymbol = getPropsSymbol(ast);

  const contextSymbols = getContextSymbols(ast);

  ast.forEachDescendant((parentNode) => {
    if (Node.isPropertyAccessExpression(parentNode)) {
      const node = parentNode.getExpression();
      const aliasSymbol = node.getType().getTargetType()?.getAliasSymbol();
      const isSignal = aliasSymbol === signalSymbol;

      if (!isSignal) return;

      let isInsideType = false;
      let isInsideDeclaration = false;
      node.getParentWhile((parent, child) => {
        // stop once we hit the function block
        if (Node.isBlock(child) || Node.isBlock(parent)) {
          return false;
        }

        // crawl up parents to make sure we're not inside a type
        if (Node.isTypeNode(parent) || Node.isTypeAliasDeclaration(parent)) {
          isInsideType = true;
          return false;
        }

        return true;
      });

      if (isInsideType) return;
      if (isInsideDeclaration) return;

      const nodeSymbol = node.getSymbol();

      if (
        Node.isPropertyAccessExpression(node) &&
        node.getExpression().getSymbol() === propsSymbol
      ) {
        reactiveValues.props.add(node.getNameNode().getText());
      } else if (nodeSymbol && contextSymbols.has(nodeSymbol)) {
        reactiveValues.context.add(node.getText());
      } else {
        reactiveValues.state.add(node.getText());
      }
    }
  });

  return reactiveValues;
};