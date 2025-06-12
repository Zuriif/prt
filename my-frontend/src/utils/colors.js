// A consistent color palette for charts
export const COLORS = [
    '#0088FE', // Blue
    '#00C49F', // Teal
    '#FFBB28', // Yellow
    '#FF8042', // Orange
    '#8884D8', // Purple
    '#82CA9D', // Green
    '#FF6B6B', // Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Light Blue
    '#96CEB4', // Sage
    '#FFEEAD', // Cream
    '#D4A5A5', // Rose
    '#9B59B6', // Deep Purple
    '#3498DB', // Bright Blue
    '#E67E22', // Deep Orange
    '#2ECC71'  // Emerald
];

// Color scales for different chart types
export const COLOR_SCALES = {
    // For heatmaps and gradients
    sequential: [
        '#f7fbff',
        '#deebf7',
        '#c6dbef',
        '#9ecae1',
        '#6baed6',
        '#4292c6',
        '#2171b5',
        '#08519c',
        '#08306b'
    ],
    // For diverging data
    diverging: [
        '#67001f',
        '#b2182b',
        '#d6604d',
        '#f4a582',
        '#fddbc7',
        '#f7f7f7',
        '#d1e5f0',
        '#92c5de',
        '#4393c3',
        '#2166ac',
        '#053061'
    ],
    // For categorical data
    categorical: COLORS
};

// Helper function to get a color by index
export const getColorByIndex = (index) => COLORS[index % COLORS.length];

// Helper function to get a color scale by type
export const getColorScale = (type = 'categorical') => COLOR_SCALES[type] || COLORS; 