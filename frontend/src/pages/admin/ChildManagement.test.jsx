import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import ChildManagement from './ChildManagement';
import * as childService from '../../services/childService';

// Mock the childService
vi.mock('../../services/childService');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const AllTheProviders = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  </QueryClientProvider>
);

describe('ChildManagement Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    queryClient.clear();
  });

  test('renders loading state initially', () => {
    childService.getChildren.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<AllTheProviders><ChildManagement /></AllTheProviders>);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders error state if fetching children fails', async () => {
    const errorMessage = 'Failed to fetch';
    childService.getChildren.mockRejectedValue(new Error(errorMessage));
    render(<AllTheProviders><ChildManagement /></AllTheProviders>);
    expect(await screen.findByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
  });

  test('displays a list of children when fetching is successful', async () => {
    const mockChildren = [
      { id: '1', name: 'Alice', age: 8, grade_level: '3rd' },
      { id: '2', name: 'Bob', age: 10, grade_level: '5th' },
    ];
    childService.getChildren.mockResolvedValue(mockChildren);
    render(<AllTheProviders><ChildManagement /></AllTheProviders>);

    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  test('opens the modal to add a new child', async () => {
    childService.getChildren.mockResolvedValue([]);
    render(<AllTheProviders><ChildManagement /></AllTheProviders>);

    fireEvent.click(screen.getByText(/add child/i));

    expect(await screen.findByText(/create a new child profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/child's name/i)).toBeInTheDocument();
  });

  test('allows creating a new child', async () => {
    childService.getChildren.mockResolvedValue([]);
    childService.createChild.mockResolvedValue({ id: '3', name: 'Charlie', pin: '1234' });

    render(<AllTheProviders><ChildManagement /></AllTheProviders>);

    fireEvent.click(screen.getByText(/add child/i));

    await screen.findByText(/create a new child profile/i);

    fireEvent.change(screen.getByLabelText(/child's name/i), { target: { value: 'Charlie' } });
    fireEvent.change(screen.getByLabelText(/4-digit pin/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByText(/save child/i));

    await waitFor(() => {
      expect(childService.createChild).toHaveBeenCalledWith({ 
        name: 'Charlie', 
        pin: '1234', 
        age: null, 
        grade_level: '' 
      });
    });
  });
});
