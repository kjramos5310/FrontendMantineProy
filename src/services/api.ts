const API_URL = 'http://localhost:3000'; // Ajusta según tu entorno

export const fetchAPI = async (endpoint: string, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${await response.text()}`);
    }

    // Verificar si la respuesta tiene un cuerpo
    const textResponse = await response.text();
    if (!textResponse) {
      return {}; // Si no hay contenido, retornar un objeto vacío o lo que sea adecuado
    }

    // Intentar parsear la respuesta como JSON
    return JSON.parse(textResponse);
  } catch (error) {
    console.error('Error en fetchAPI:', error);
    throw error;
  }
};
