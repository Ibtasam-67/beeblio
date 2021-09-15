import React, { Fragment, useRef } from 'react'
import { OxfordDictionaryResult, LexicalEntry, Entry, Pronunciation, Inflection, Sense, Example } from '../../context/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { Event, SetDimension, InitAndPageViewGA } from "../../components/Tracking";

const OxfordThesaurus = (props: any) => {
    const oxfordResult: OxfordDictionaryResult[] = props.oxfordResult;
    const audioRef: any = useRef(null);

    const user: any = localStorage.getItem('currentUser');
    const currentUser: any = JSON.parse(user);

    const handleAudio = (audioUrl: any) => {    
        audioRef.current.src = audioUrl;
        audioRef.current.play();

        Event('Dictionary', 'Play Audio of entry', 'Played Audio: '+audioUrl);        
    }

    return (
        <Fragment>
            {
                oxfordResult && oxfordResult.map(
                    (result: OxfordDictionaryResult, index: number) => {
                        return <div key={index}>
                            {
                                result.lexicalEntries && result.lexicalEntries.map(
                                    (lexicalEntry: LexicalEntry, index: number) => {
                                        {
                                            return <Fragment>
                                                <h5>{lexicalEntry.lexicalCategory.text}</h5>
                                                {lexicalEntry.entries &&
                                                    lexicalEntry.entries.map((entry: Entry, enIndex: number) => {
                                                        return <Fragment>
                                                            {entry.pronunciations &&
                                                                entry.pronunciations.map(
                                                                    (pronunciation: Pronunciation, prIndex: number) => {
                                                                        return <Fragment>
                                                                            <p className="mb-0">[{pronunciation.phoneticSpelling}]
                                                                                (
                                                                                {pronunciation.dialects &&
                                                                                    pronunciation.dialects.map(
                                                                                        (dialect: any, diIndex: number) => {
                                                                                            return <span>{dialect}</span>
                                                                                        }
                                                                                    )
                                                                                })
                                                                                </p>
                                                                            {pronunciation.audioFile &&
                                                                                <button className="btn-link" onClick={() => {
                                                                                    handleAudio(pronunciation.audioFile)
                                                                                }}>
                                                                                    <FontAwesomeIcon className="mr-2" icon={faVolumeUp} />Play Audio</button>}
                                                                        </Fragment>
                                                                    }
                                                                )
                                                            }

                                                            {entry.inflections && entry.inflections.length > 0 &&
                                                                <h5 className="mb-0">Inflections</h5>
                                                            }
                                                            {entry.inflections &&
                                                                entry.inflections.map(
                                                                    (inflecetion: Inflection, prIndex: number) => {
                                                                        return <p>{inflecetion.inflectedForm}</p>
                                                                    }
                                                                )
                                                            }
                                                            {
                                                                <Fragment>
                                                                    {/* {entry.senses && entry.senses.length > 0 &&
                                                                        <h5>Definitions</h5>
                                                                    }                                                                     */}
                                                                    {entry.senses && entry.senses.map((sense: Sense, senIndex: number) => {
                                                                        return <Fragment>

                                                                            {sense.definitions && sense.definitions.length > 0 &&
                                                                                <p className="mb-0 mt-4 font-italic">Definition {senIndex + 1}:</p>
                                                                            }
                                                                                                                                             
                                                                            {
                                                                                sense.definitions && sense.definitions.map(
                                                                                    (defination: string, defIndex: number) => {
                                                                                        return <p className="mb-0">{defination}</p>
                                                                                    }
                                                                                )
                                                                            }
                                                                            {
                                                                                sense.shortDefinitions && sense.shortDefinitions.map(
                                                                                    (shortdefination: string, defIndex: number) => {
                                                                                        return <p className="mb-0">{shortdefination} (short def)</p>
                                                                                    }
                                                                                )
                                                                            }
                                                                            {sense.examples && sense.examples.length > 0 &&
                                                                                <p className="mb-0 font-weight-bold">Examples:</p>
                                                                            }
                                                                            {
                                                                                sense.examples && sense.examples.map(
                                                                                    (example: Example, exIndex: number) => {
                                                                                        return <div> 
                                                                                        <p className="mb-0">{example.text}</p>

                                                                                        {sense.synonyms && sense.synonyms.length > 0 &&
                                                                                        <div><p className="mb-0"> SYNONYMS </p> 
                                                                                        <p className="mb-0">{sense.synonyms.map( s => s.text).join(', ')}</p>
                                                                                        </div> 
                                                                                        }
                                                                                        {sense.subsenses && sense.subsenses.length > 0 &&
                                                                                        <div>
                                                                                        <p className="mb-0">{sense?.subsenses?.map( s => s?.synonyms?.map(sn=>sn.text)?.join(', ') )?.join(' | ')}</p>
                                                                                        </div> 
                                                                                        }

                                                                                        </div>
                                                                                    }
                                                                                )
                                                                            }

                                                                        </Fragment>
                                                                    })}
                                                                </Fragment>
                                                            }
                                                        </Fragment>
                                                    })
                                                }

                                                {lexicalEntry.phrases && lexicalEntry.phrases.length > 0 &&
                                                    <h5>Phrases</h5>
                                                }
                                                {lexicalEntry.phrases &&
                                                    lexicalEntry.phrases.map(
                                                        (phrase: any, prIndex: number) => {
                                                            return <p>{phrase.text}</p>
                                                        }
                                                    )
                                                }
                                            </Fragment>
                                        }

                                    }
                                )
                            }

                        </div>
                    }
                )
            }
            <audio ref={audioRef} />
        </Fragment>
    )
}

export default OxfordThesaurus;
