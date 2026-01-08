import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const templateConfigKeys = {
  all: ['templateConfig'] as const,
  detail: (templateId: string) => [...templateConfigKeys.all, templateId] as const
};

export function useTemplateConfig(templateId: string) {
  return useQuery({
    queryKey: templateConfigKeys.detail(templateId),
    queryFn: async () => {
      const response = await fetch(`/api/templates/${templateId}/config`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      return data.configData || null;
    },
    enabled: !!templateId
  });
}

export function useUpdateTemplateConfig () {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      templateId,
      configData
    }: {
      templateId: string;
      configData: {
        category?: string,
        data: Array<{name: string, price: string}>
      }
    }) => {
      console.log('Mutation çağrıldı:', { templateId, configData });
      const response = await fetch(`/api/templates/${templateId}/config`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(configData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('API hatası:', response.status, errorData);
        throw new Error(errorData.message || 'Failed to update.');
      }
      
      const result = await response.json();
      console.log('API başarılı:', result);
      return result;
    },
    onSuccess: (data,variables) => {
      console.log('Mutation başarılı, cache güncelleniyor:', variables);
      queryClient.setQueryData(
        templateConfigKeys.detail(variables.templateId),
        variables.configData
      )
    },
    onError: (error) => {
      console.error('Mutation hatası:', error);
    }
  })
}