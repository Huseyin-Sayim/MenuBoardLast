import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const templateConfigKeys = {
  all: ['templateConfig'] as const,
  detail: (templateId: string, configId?: string) => 
    configId 
      ? [...templateConfigKeys.all, templateId, configId] as const
      : [...templateConfigKeys.all, templateId] as const
};

export function useTemplateConfig(templateId: string, configId?: string) {
  return useQuery({
    queryKey: templateConfigKeys.detail(templateId, configId),
    queryFn: async () => {
      const url = configId 
        ? `/api/templates/${templateId}/config?configId=${configId}`
        : `/api/templates/${templateId}/config`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      return { configData: data.configData || null, configId: data.configId };
    },
    enabled: !!templateId
  });
}

export function useUpdateTemplateConfig () {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      templateId,
      configData,
      configId
    }: {
      templateId: string;
      configData: {
        // Template-1 formatı
        category?: string,
        data?: Array<{name: string, price: string}>,
        // Template-2 formatı
        categories?: Record<string, string>,
        // Template-2 için data bir object (Record<string, Array>)
        [key: string]: any
      };
      configId?: string;
    }) => {
      console.log('Mutation çağrıldı:', { templateId, configData, configId });
      const response = await fetch(`/api/templates/${templateId}/config`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ ...configData, configId })
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
      const savedConfigId = data?.data?.id || variables.configId;
      queryClient.setQueryData(
        templateConfigKeys.detail(variables.templateId, savedConfigId),
        { configData: variables.configData, configId: savedConfigId }
      )
      // Eski configId ile cache'i de invalidate et (eğer configId değiştiyse)
      if (variables.configId && savedConfigId && variables.configId !== savedConfigId) {
        queryClient.invalidateQueries({ queryKey: templateConfigKeys.detail(variables.templateId, variables.configId) });
      }
    },
    onError: (error) => {
      console.error('Mutation hatası:', error);
    }
  })
}