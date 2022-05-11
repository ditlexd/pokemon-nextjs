import { render, screen } from '@testing-library/react';
import Home from '../pages';
import * as client from '../lib/APIClient';
import userEvent from '@testing-library/user-event';

describe('Home', () => {
  it('First input box should have focus on load', () => {
    // @ts-ignore
    client.getName = jest.fn((name: string) => ({ name }));
    // @ts-ignore
    client.checkAnswer = jest.fn((id: number, name: string) => ({
      isCorrect: true,
      correctName: name,
    }));

    render(<Home nameLength={3} imageUrl={''} id={1} />);

    const focusedElement = screen.getByTestId('pokemonInput0');
    expect(focusedElement).toHaveFocus();
  });

  it('Should display pokemon name when guess is correct', async () => {
    // @ts-ignore
    client.getName = jest.fn((id: number) => ({ name: 'lol' }));
    // @ts-ignore
    client.checkAnswer = jest.fn((id: number, name: string) => ({
      isCorrect: true,
      correctName: name,
    }));

    render(<Home nameLength={3} imageUrl={''} id={1} />);

    const input0 = screen.getByTestId('pokemonInput0');
    const input1 = screen.getByTestId('pokemonInput1');
    const input2 = screen.getByTestId('pokemonInput2');

    await userEvent.type(input0, 'l');
    await userEvent.type(input1, 'o');
    await userEvent.type(input2, 'l');

    const submitButton = screen.getByTestId('submit-button');
    await userEvent.click(submitButton);

    expect(screen.getByText("It's LOL")).not.toBeNull();
  });
});
