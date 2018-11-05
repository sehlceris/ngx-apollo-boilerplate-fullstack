export function GetOperationId(model: string, operation: string, title?: string, deprecated: boolean = false) {
  const _model = ToTitleCase(model).replace(/\s/g, '');
  const _operation = ToTitleCase(operation).replace(/\s/g, '');

  return {
    title: title || '',
    operationId: `${_model}_${_operation}`,
    deprecated,
  };
}

function ToTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(' ');
}
