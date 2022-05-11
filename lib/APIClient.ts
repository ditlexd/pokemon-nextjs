import { CheckAnswerResponse } from '../pages/api/check-answer';
import { GetNameResponse } from '../pages/api/name';

export async function checkAnswer(
  id: number,
  name: string,
): Promise<CheckAnswerResponse> {
  return fetch(`/api/check-answer?id=${id}&name=${name}`).then((res) =>
    res.json(),
  );
}

export async function getName(id: number): Promise<GetNameResponse> {
  return fetch(`/api/name?id=${id}`).then((res) => res.json());
}
