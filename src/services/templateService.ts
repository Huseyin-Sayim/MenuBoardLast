interface TemplateProps {
  name: string;
  component: string;
}

export const createTemplate = async (formData: FormData) => {
  try {
    const template = formData.get('template');
  } catch (error: any) {

  }
}