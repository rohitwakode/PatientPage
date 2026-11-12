const normalizeDoctorImage = (image) => {
    const imageUrl = typeof image === 'string'
        ? image.trim()
        : image?.secure_url ?? image?.url ?? ''

    if (imageUrl.startsWith('//')) return `https:${imageUrl}`
    if (/^http:\/\/res\.cloudinary\.com\//i.test(imageUrl)) {
        return imageUrl.replace(/^http:/i, 'https:')
    }

    return imageUrl
}

export const normalizeDoctor = (doctor) => {
    const id = doctor.docId ?? doctor.id ?? doctor._id
    const address = doctor.address ?? {}
    const image = normalizeDoctorImage(doctor.docImage ?? doctor.image)

    return {
        ...doctor,
        id,
        _id: id,
        name: doctor.docName ?? doctor.name,
        image,
        address: {
            ...address,
            line1: address.address ?? address.line1 ?? '',
            line2: [address.city, address.state, address.pincode, address.country]
                .filter(Boolean)
                .join(', ') || address.line2 || ''
        }
    }
}

export const normalizePatient = (patient) => {
    const address = patient.addRes ?? {}
    const gender = patient.gender ?? ''

    return {
        ...patient,
        id: patient.id ?? patient.Id,
        dob: patient.dateOfBirth?.slice(0, 10) ?? '',
        gender: gender ? `${gender[0]}${gender.slice(1).toLowerCase()}` : '',
        address: {
            ...address,
            line1: address.address ?? '',
            line2: [address.city, address.state, address.pincode, address.country]
                .filter(Boolean)
                .join(', ')
        }
    }
}
