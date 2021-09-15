import React, { Fragment } from 'react'
import { Result } from '../../context/types';

const WordsApi = (props: any) => {

    const wordsApiResult = props.wordsApiResult;
    return (
        <div className="mt-2">
            <h5> [{wordsApiResult?.pronunciation?.all ? wordsApiResult?.pronunciation?.all : wordsApiResult.pronunciation.length ? wordsApiResult.pronunciation : wordsApiResult.word}]</h5>
            {wordsApiResult?.syllables && <p>Syllable: {wordsApiResult?.syllables.list.join(' ')}</p>}
            {
                wordsApiResult.results && wordsApiResult.results.map(
                    (result: Result, index: number) => {
                        return <div key={index}>
                            {result.partOfSpeech && <h5>{result.partOfSpeech}</h5>}
                            {
                                result.definition && <Fragment>
                                    <p className="font-weight-bold mb-0">Definition</p>
                                    <p>{result.definition}</p>
                                </Fragment>
                            }
                            {result?.examples && <Fragment>
                                <p className="font-weight-bold mb-0">Examples</p>
                                <p className="mb-4">
                                    {result.examples.map(
                                        example => {
                                            return <li>{example}</li>
                                        }
                                    )
                                    }
                                </p>{result?.synonyms && <Fragment>
                                    <p className="mb-0 font-weight-bold">Synonyms</p>
                                    {
                                        result?.synonyms.join(' ,')
                                    }
                                </Fragment>
                                }
                            </Fragment>
                            }
                            {result.antonyms && <Fragment>
                                <p className="mb-0 font-weight-bold">Antoynyms</p>
                                {
                                    result.antonyms.map(
                                        anto => {
                                            return <p className="ml-5">{anto}</p>
                                        }
                                    )
                                }
                            </Fragment>
                            }

                        </div>
                    }
                )
            }
        </div>
    )
}

export default WordsApi;
